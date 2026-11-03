import type { IObserver, IObserverFunction } from '../src/subscriber';

import { createMockedObserver, createDeactivator } from '.';

export function getCasesAfterDeactivation() {
  return [
    {
      description: 'При вызове после subscriber.complete',
      deactivate: createDeactivator('complete'),
    },
    {
      description: 'При вызове после subscriber.error',
      deactivate: createDeactivator('error'),
    },
    {
      description:
        'При вызове после того как сигнал переданный в конструкторе перейдёт в состояние aborted',
      deactivate: createDeactivator('signal.abort'),
    },
  ];
}

export function getCasesWithObserverNext() {
  return [
    {
      description: 'Если observer задан в виде объекта с методом next',
      nextName: 'observer.next',
      createObserver: (next: IObserverFunction<unknown>) => {
        const observer = createMockedObserver() satisfies IObserver<unknown>;

        return {
          ...observer,
          next,
        };
      },
    },
    {
      description: 'Если observer задан как функция',
      nextName: 'observer',
      createObserver: (next: IObserverFunction<unknown>) => next,
    },
  ];
}

export function getCasesWithoutObserverNext() {
  return [
    {
      description: 'Если observer задан в виде объекта без метода next',
      createObserver: () => {
        const { next, ...observer } = createMockedObserver();
        return observer;
      },
    },
    {
      description: 'Observer не задан',
      createObserver: () => undefined,
    },
  ];
}
