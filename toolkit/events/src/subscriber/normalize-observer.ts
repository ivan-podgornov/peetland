import type { IObserver, IObserverObject } from './types';

export type NormalizedObserver<T> = Required<IObserverObject<T>>;

/** Приводит переданный observer к одному формату, когда observer является объектом со всеми методами */
export function normalizeObserver<T>(observer?: IObserver<T>): NormalizedObserver<T> {
  // Нужно объявлять именно здесь, потому что функции next, error, complete могут добавиться
  // в EventTarget в качестве слушателей событий. Если noop будет одной и той же функцией для
  // нескольких наблюдателей, EventTarget дедуплицирует и добавить одиного слушателя для нескольких
  // наблюдателей, что неправильно.
  function noop() {}

  const defaultObserver: NormalizedObserver<T> = {
    next: noop,
    // Ошибку, которую наблюдатель не обрабатывает, некому передать дальше
    error: (error) => reportError(error),
    complete: noop,
  };

  if (!observer) {
    return defaultObserver;
  }

  if (typeof observer === 'function') {
    // Оборачиваем, а не кладём observer как есть: в Lua next вызывается как метод, и функция без
    // self получила бы вместо значения сам объект наблюдателя
    return { ...defaultObserver, next: (value: T) => observer(value) };
  }

  // Методы вызываются через observer, а не через bind: в Lua bind ломает передачу self
  const { next, complete, error } = observer;

  return {
    next: typeof next === 'function' ? (value) => observer.next?.(value) : defaultObserver.next,
    complete:
      typeof complete === 'function' ? () => observer.complete?.() : defaultObserver.complete,
    error:
      typeof error === 'function' ? (reason) => observer.error?.(reason) : defaultObserver.error,
  };
}
