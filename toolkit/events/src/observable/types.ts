import type { IAbortSignal } from '../abort-signal';
import type { ISubscriber } from '../subscriber';

import type { Observable } from './observable';

export type ErrorHandler = (error?: unknown) => void;

export type Executor<T> = (subscriber: ISubscriber<T>) => void;

export type ObservableOptions = {
  onError?: ErrorHandler;
};

/** Значения, которые Observable.from умеет превращать в Observable */
export type ObservableInput<T> = Observable<T> | ReadonlyArray<T> | Promise<T>;

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
