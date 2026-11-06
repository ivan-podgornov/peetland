import { MulticastObserver } from '../multicast-observer';
import { Subscriber } from '../subscriber';
import type { IObserver, ISubscriber, SubscriberConstructorOptions } from '../subscriber';

import { createArrayExecutor, createPromiseExecutor } from './from-executors';
import { InspectOperator } from './inspect-operator';
import { SwitchMapOperator } from './switch-map-operator';
import type { Executor, Inspector, ISubscribable, Mapper, SubscribeOptions } from './types';

/** Значения, которые Observable.from умеет превращать в Observable */
export type ObservableInput<T> = Observable<T> | ReadonlyArray<T> | Promise<T>;

export class Observable<T> implements ISubscribable<T> {
  private readonly executor: Executor<T>;
  private multicast: MulticastObserver<T> | null;
  private subscriber: ISubscriber<T> | null;

  /**
   * Первым параметром принимает функцию, которая вызывается при подписке первого наблюдателя.
   * Функция принимает подписчика и может сгенерировать новые значения в этом подписчике.
   */
  constructor(executor: Executor<T>) {
    this.executor = executor;
    this.multicast = null;
    this.subscriber = null;
  }

  /**
   * Превращает значение в Observable. Если передан Observable, возвращает его же. Массив выдаёт
   * свои элементы синхронно при подписке и завершается. Промис выдаёт значение, с которым
   * выполнился, и завершается, а если отклонён, завершается с ошибкой.
   * Для остальных значений выбрасывает TypeError.
   */
  static from<T>(value: ObservableInput<T>): Observable<T> {
    if (value instanceof Observable) {
      return value;
    }

    if (Array.isArray(value)) {
      return new Observable(createArrayExecutor<T>(value));
    }

    if (value instanceof Promise) {
      return new Observable(createPromiseExecutor(value));
    }

    throw new TypeError('Observable.from поддерживает только Observable, массивы и промисы');
  }

  /**
   * Подписывает наблюдателя к подписке. Если в options указано поле signal, наблюдатель будет
   * отписан, когда подписка перейдёт в состояние aborted.
   */
  subscribe(observer?: IObserver<T>, options: SubscribeOptions = {}): void {
    const multicast = this.getOrCreateMulticast();
    multicast.add(observer, options);

    const subscriberActive = this.subscriber?.active ?? false;
    const subscriber = this.getOrCreateSubscriber(multicast, { signal: multicast.signal });

    if (!subscriberActive) {
      try {
        this.executor(subscriber);
      } catch (error) {
        subscriber.error(error);
      }
    }
  }

  /**
   * Возвращает Observable, который превращает каждое значение этого Observable во внутренний
   * Observable с помощью mapper и выдаёт значения только последнего из них. Когда приходит новое
   * значение, подписка на предыдущий внутренний Observable отменяется. Результат завершается,
   * когда завершились и этот Observable, и последний внутренний.
   */
  switchMap<R>(mapper: Mapper<T, ObservableInput<R>>): Observable<R> {
    return new Observable<R>((subscriber) => {
      // Оператор создаётся на каждую подписку, потому что хранит её состояние
      const operator = new SwitchMapOperator({
        subscriber,
        mapper,
        toObservable: (input) => Observable.from(input),
      });

      operator.observe(this);
    });
  }

  /**
   * Возвращает Observable, который выдаёт те же события, что и этот, и попутно вызывает колбэки
   * inspector: при подписке, на каждое значение, при завершении и при отписке наблюдателя.
   * Исключение в колбэке inspector, кроме abort, завершает поток с этим исключением.
   */
  inspect(inspector: Inspector<T> = {}): Observable<T> {
    return new Observable<T>((subscriber) => {
      const operator = new InspectOperator({
        subscriber,
        inspector,
      });

      operator.observe(this);
    });
  }

  /**
   * Возвращает мультикаст если он уже создан и если subscriber ещё активен.
   * В ином случае создаёт мультикаст и возращает его
   */
  private getOrCreateMulticast(): MulticastObserver<T> {
    if (this.multicast && this.subscriber && this.subscriber.active) {
      return this.multicast;
    }

    this.multicast = new MulticastObserver<T>();
    return this.multicast;
  }

  /**
   * Возвращает subscriber, если он уже создан и активен.
   * В ином случае, создаёт новый subscriber и возвращает его
   */
  private getOrCreateSubscriber(
    observer: IObserver<T>,
    options: SubscriberConstructorOptions
  ): ISubscriber<T> {
    if (this.subscriber && this.subscriber.active) {
      return this.subscriber;
    }

    this.subscriber = new Subscriber(observer, options);

    return this.subscriber;
  }
}
