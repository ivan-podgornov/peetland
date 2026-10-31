// Observable наследуется от этого класса, поэтому импортировать Observable здесь можно только как
// тип, иначе появится циклическая зависимость. Экземпляры создаются через this: при вызове
// Observable.from в this лежит сам класс Observable.

import type { Observable } from './observable';
import type { Executor, ObservableInput } from './types';

type ObservableConstructor = new <T>(executor: Executor<T>) => Observable<T>;

// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- класс нужен только для того, чтобы Observable унаследовал его статические методы
export class ObservableFactory {
  /**
   * Превращает значение в Observable. Если передан Observable, возвращает его же. Массив выдаёт
   * свои элементы синхронно при подписке и завершается. Промис выдаёт значение, с которым
   * выполнился, и завершается, а если отклонён, завершается с ошибкой.
   * Для остальных значений выбрасывает TypeError.
   */
  static from<T>(this: ObservableConstructor, value: ObservableInput<T>): Observable<T> {
    if (value instanceof this) {
      return value;
    }

    if (Array.isArray(value)) {
      return fromArray<T>(this, value);
    }

    if (value instanceof Promise) {
      return fromPromise(this, value);
    }

    throw new TypeError('Observable.from поддерживает только Observable, массивы и промисы');
  }
}

function fromArray<T>(
  ObservableClass: ObservableConstructor,
  values: ReadonlyArray<T>
): Observable<T> {
  return new ObservableClass<T>((subscriber) => {
    // Массив читается при каждой подписке, а не при вызове from, как того требует спецификация
    for (const value of values) {
      if (!subscriber.active) {
        return;
      }

      subscriber.next(value);
    }

    subscriber.complete();
  });
}

function fromPromise<T>(
  ObservableClass: ObservableConstructor,
  promise: Promise<T>
): Observable<T> {
  return new ObservableClass<T>((subscriber) => {
    promise.then(
      (value) => {
        subscriber.next(value);
        subscriber.complete();
      },
      (reason: unknown) => subscriber.error(reason)
    );
  });
}
