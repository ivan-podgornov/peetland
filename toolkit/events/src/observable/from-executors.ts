import type { Executor } from './types';

/**
 * Executor для Observable.from из массива: выдаёт элементы синхронно при подписке и завершается.
 * Массив читается при каждой подписке, а не при вызове from, как того требует спецификация
 */
export function createArrayExecutor<T>(values: ReadonlyArray<T>): Executor<T> {
  return (subscriber) => {
    for (const value of values) {
      if (!subscriber.active) {
        return;
      }

      subscriber.next(value);
    }

    subscriber.complete();
  };
}

/**
 * Executor для Observable.from из промиса: выдаёт значение, с которым промис выполнился, и
 * завершается, а если промис отклонён, завершается с ошибкой
 */
export function createPromiseExecutor<T>(promise: Promise<T>): Executor<T> {
  return (subscriber) => {
    promise.then(
      (value) => {
        subscriber.next(value);
        subscriber.complete();
      },
      (reason: unknown) => subscriber.error(reason)
    );
  };
}
