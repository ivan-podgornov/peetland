import type { AbortListener } from '../abort-signal';
import type { IObserverObject, ISubscriber } from '../subscriber';

import type { Observable } from './observable';
import type { Inspector, InspectorObject } from './types';

export type InspectObserverOptions<T> = {
  /** Подписчик результата inspect, которому передаются события исходного Observable */
  subscriber: ISubscriber<T>;
  inspector: Inspector<T>;
};

/**
 * Наблюдатель исходного Observable в одной подписке на результат inspect. Вызывает колбэки
 * инспектора и передаёт события подписчику без изменений. Исключение в колбэке инспектора
 * завершает поток с этим исключением.
 */
export class InspectObserver<T> implements IObserverObject<T> {
  private readonly subscriber: ISubscriber<T>;
  private readonly inspector: InspectorObject<T>;
  private readonly abortListener: AbortListener;

  constructor(options: InspectObserverOptions<T>) {
    this.subscriber = options.subscriber;
    const { inspector } = options;
    // Функцию оборачиваем, а не кладём как есть: в Lua next вызывается как метод, и функция без
    // self получила бы вместо значения сам объект inspector
    this.inspector =
      typeof inspector === 'function' ? { next: (value: T) => inspector(value) } : inspector;
    this.abortListener = () => this.callAbort();
  }

  /** Вызывает inspector.subscribe и, если он не выбросил исключение, подписывается на source */
  observe(source: Observable<T>): void {
    try {
      this.inspector.subscribe?.();
    } catch (error) {
      this.subscriber.error(error);
      return;
    }

    this.subscriber.signal.addEventListener('abort', this.abortListener);
    source.subscribe(this, { signal: this.subscriber.signal });
  }

  next(value: T): void {
    try {
      this.inspector.next?.(value);
    } catch (error) {
      this.finish(() => this.subscriber.error(error));
      return;
    }

    this.subscriber.next(value);
  }

  error(error?: unknown): void {
    this.finish(() => {
      this.inspector.error?.(error);
      this.subscriber.error(error);
    });
  }

  complete(): void {
    this.finish(() => {
      this.inspector.complete?.();
      this.subscriber.complete();
    });
  }

  /**
   * Завершает поток, не вызывая inspector.abort. Подписчик при завершении тоже переводит свой
   * сигнал в состояние aborted, поэтому слушатель отписки нужно снять заранее. Если finishing
   * выбросил исключение, поток завершается с ним
   */
  private finish(finishing: () => void): void {
    this.subscriber.signal.removeEventListener('abort', this.abortListener);

    try {
      finishing();
    } catch (error) {
      this.subscriber.error(error);
    }
  }

  private callAbort(): void {
    try {
      this.inspector.abort?.(this.subscriber.signal.reason);
    } catch (error) {
      // К этому моменту передать исключение в поток уже нельзя
      reportError(error);
    }
  }
}
