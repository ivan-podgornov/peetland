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

export type SubscribeOptions = {
  signal?: IAbortSignal;
};
