import { AbortController } from '../abort-controller';
import type { IAbortSignal } from '../abort-signal';
import { AbortSignal } from '../abort-signal';
import type { IObserverObject, ISubscriber } from '../subscriber';

import type { Observable } from './observable';
import type { Mapper, ObservableInput } from './types';

export type SwitchMapObserverOptions<T, R> = {
  /** Подписчик результата switchMap, которому передаются значения внутренних Observable */
  subscriber: ISubscriber<R>;
  mapper: Mapper<T, ObservableInput<R>>;
  /** Превращает результат mapper в Observable */
  toObservable: (input: ObservableInput<R>) => Observable<R>;
};

/**
 * Наблюдатель исходного Observable в одной подписке на результат switchMap. На каждое значение
 * отписывается от предыдущего внутреннего Observable и подписывается на новый, полученный из
 * mapper. Результат завершается, когда завершились и исходный Observable, и последний внутренний.
 */
export class SwitchMapObserver<T, R> implements IObserverObject<T> {
  private readonly subscriber: ISubscriber<R>;
  private readonly mapper: Mapper<T, ObservableInput<R>>;
  private readonly toObservable: (input: ObservableInput<R>) => Observable<R>;
  private index: number;
  private sourceCompleted: boolean;
  private innerController: AbortController | null;

  constructor(options: SwitchMapObserverOptions<T, R>) {
    this.subscriber = options.subscriber;
    this.mapper = options.mapper;
    this.toObservable = options.toObservable;
    this.index = 0;
    this.sourceCompleted = false;
    this.innerController = null;
  }

  next(value: T): void {
    // По спецификации предыдущий внутренний Observable отменяется до вызова mapper
    this.innerController?.abort();
    const controller = new AbortController();
    this.innerController = controller;

    let inner: Observable<R>;
    try {
      inner = this.toObservable(this.mapper(value, this.index));
    } catch (error) {
      this.subscriber.error(error);
      return;
    }

    this.index += 1;
    this.subscribeToInner(inner, controller.signal);
  }

  error(error?: unknown): void {
    this.subscriber.error(error);
  }

  complete(): void {
    this.sourceCompleted = true;

    if (!this.innerController) {
      this.subscriber.complete();
    }
  }

  private subscribeToInner(inner: Observable<R>, innerSignal: IAbortSignal): void {
    inner.subscribe(
      {
        next: (value) => this.subscriber.next(value),
        error: (error) => this.subscriber.error(error),
        complete: () => this.completeInner(),
      },
      { signal: AbortSignal.any([this.subscriber.signal, innerSignal]) }
    );
  }

  private completeInner(): void {
    if (this.sourceCompleted) {
      this.subscriber.complete();
    } else {
      this.innerController = null;
    }
  }
}
