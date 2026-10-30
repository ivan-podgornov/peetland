import { vi } from 'vitest';

import { Observable } from '../src';
import type { ISubscriber, ObservableOptions } from '../src';

/** Ждёт, пока выполнятся все микрозадачи, запланированные к этому моменту */
export function flushPromises(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve));
}

/** Создаёт Observable, который запоминает своих подписчиков, чтобы тест управлял ими */
export function createControlledObservable(options: ObservableOptions = {}) {
  const subscribers: Array<ISubscriber<unknown>> = [];
  const executor = vi.fn((subscriber: ISubscriber<unknown>) => {
    subscribers.push(subscriber);
  });

  const observable = new Observable(executor, options);

  function last() {
    const last = subscribers[subscribers.length - 1];

    if (!last) {
      throw new Error('Ни один подписчик пока что не был инициализирован');
    }

    return last;
  }

  return {
    observable,
    executor,
    subscribers,
    /** Возвращает последнего подписчика, который был инициирован в observable */
    get subscriber(): ISubscriber<unknown> {
      return {
        get active() {
          return last().active;
        },
        get signal() {
          return last().signal;
        },
        addTeardown: (...args) => last().addTeardown(...args),
        complete: (...args) => last().complete(...args),
        next: (...args) => last().next(...args),
        error: (...args) => last().error(...args),
      };
    },
  };
}
