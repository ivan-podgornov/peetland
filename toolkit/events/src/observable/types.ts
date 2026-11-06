import type { IAbortSignal } from '../abort-signal';
import type { IObserver, IObserverObject, ISubscriber } from '../subscriber';

export type Executor<T> = (subscriber: ISubscriber<T>) => void;

/** То, на что можно подписаться. Через этот интерфейс операторы подписываются на Observable */
export interface ISubscribable<T> {
  subscribe(observer?: IObserver<T>, options?: SubscribeOptions): void;
}

/**
 * Оператор Observable, например inspect или switchMap. Создаётся на каждую подписку на результат
 * оператора, потому что хранит её состояние: подписывается на исходный Observable и передаёт его
 * события, изменённые по-своему, подписчику результата
 */
export interface IOperator<T> extends IObserverObject<T> {
  /** Подписывает оператор на исходный Observable */
  observe(source: ISubscribable<T>): void;
}

/** Функция, которая превращает значение Observable и его порядковый номер в новое значение */
export type Mapper<T, R> = (value: T, index: number) => R;

export type InspectorObject<T> = {
  /** Вызывается с каждым значением Observable до того, как оно дойдёт до наблюдателя */
  next?: (value: T) => void;

  /** Вызывается, когда Observable завершился с ошибкой */
  error?: (error?: unknown) => void;

  /** Вызывается, когда Observable завершился успешно */
  complete?: () => void;

  /** Вызывается при подписке, до подписки на сам Observable */
  subscribe?: () => void;

  /** Вызывается, когда наблюдатель отписался раньше, чем Observable завершился */
  abort?: (reason?: unknown) => void;
};

/** Колбэки, которые inspect вызывает на события Observable. Функция равносильна колбэку next */
export type Inspector<T> = InspectorObject<T> | ((value: T) => void);

export type SubscribeOptions = {
  signal?: IAbortSignal;
};
