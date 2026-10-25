import { MulticastObserver } from '../multicast-observer';
import { Subscriber } from '../subscriber';
import type { IObserver, ISubscriber, SubscriberConstructorOptions } from '../subscriber';

import { ObservableFactory } from './factory';
import { InspectObserver } from './inspect-observer';
import { SwitchMapObserver } from './switch-map-observer';
import type {
  ErrorHandler,
  Executor,
  Inspector,
  Mapper,
  ObservableInput,
  ObservableOptions,
  SubscribeOptions,
} from './types';

export class Observable<T> extends ObservableFactory {
  private readonly executor: Executor<T>;
  private readonly onError: ErrorHandler;
  private multicast: MulticastObserver<T> | null;
  private subscriber: ISubscriber<T> | null;

  /**
   * Первым параметром принимает функцию, которая вызывается при подписке первого наблюдателя.
   * Функция принимает подписчика и может сгенерировать новые значения в этом подписчике.
   */
  constructor(executor: Executor<T>, options: ObservableOptions = {}) {
    super();
    this.executor = executor;
    this.onError = options.onError ?? (() => {});
    this.multicast = null;
    this.subscriber = null;
  }

  /**
   * Подписывает наблюдателя к подписке. Если в options указано поле signal, наблюдатель будет
   * отписан, когда подписка перейдёт в состояние aborted.
   */
  subscribe(observer?: IObserver<T>, options: SubscribeOptions = {}): void {
    const multicast = this.getOrCreateMulticast();
    multicast.add(observer, options);

    const subscriberActive = this.subscriber?.active ?? false;
    const subscriber = this.getOrCreateSubscriber(multicast, {
      signal: multicast.signal,
      onError: this.onError,
    });

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
  switchMap<R>(
    mapper: Mapper<T, ObservableInput<R>>,
    options: ObservableOptions = {}
  ): Observable<R> {
    return new Observable<R>((subscriber) => {
      // Наблюдатель создаётся на каждую подписку, потому что хранит её состояние
      const observer = new SwitchMapObserver({
        subscriber,
        mapper,
        toObservable: (input) => Observable.from(input, options),
      });

      this.subscribe(observer, { signal: subscriber.signal });
    }, options);
  }

  /**
   * Возвращает Observable, который выдаёт те же события, что и этот, и попутно вызывает колбэки
   * inspector: при подписке, на каждое значение, при завершении и при отписке наблюдателя.
   * Исключение в колбэке inspector, кроме abort, завершает поток с этим исключением.
   */
  inspect(inspector: Inspector<T> = {}, options: ObservableOptions = {}): Observable<T> {
    return new Observable<T>((subscriber) => {
      const observer = new InspectObserver({
        subscriber,
        inspector,
        onError: options.onError ?? (() => {}),
      });

      observer.observe(this);
    }, options);
  }

  /**
   * Возвращает мультикаст если он уже создан и если subscriber ещё активен.
   * В ином случае создаёт мультикаст и возращает его
   */
  private getOrCreateMulticast(): MulticastObserver<T> {
    if (this.multicast && this.subscriber && this.subscriber.active) {
      return this.multicast;
    }

    this.multicast = new MulticastObserver({ onError: this.onError });
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
