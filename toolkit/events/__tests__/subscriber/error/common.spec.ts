import { describe, expect, it, vi } from 'vitest';

import {
  createMockedObserver,
  describeBehaviorOnDeactivation,
  describeBehaviorOnRepeatDeactivation,
  getRepeatBehaviourCases,
  getDefaultConstructorOptions,
} from '../../../dev';
import { AbortController } from '../../../src/abort-controller';
import { Subscriber } from '../../../src/subscriber/subscriber';

const casesWithoutErrorInObserver = [
  {
    description: 'Если observer задан в виде функции',
    createObserverWithoutError: () => vi.fn(),
  },
  {
    description: 'Если observer задан в виде объекта без метода error',
    createObserverWithoutError: () => {
      const { error, ...observer } = createMockedObserver();
      return observer;
    },
  },
  {
    description: 'Если observer не задан',
    createObserverWithoutError: () => undefined,
  },
] as const;

describe('Subscriber', () => {
  describe('#error', () => {
    it('Причиной перехода subscriber.signal в состояние aborted, является значение переданное в параметре метода', () => {
      const subscriber = new Subscriber(createMockedObserver(), getDefaultConstructorOptions());
      const error = 'some error';

      subscriber.error(error);

      expect(subscriber.signal.reason).toBe(error);
    });

    it('Не вызывает observer.complete', () => {
      const observer = createMockedObserver();
      const subscriber = new Subscriber(observer, getDefaultConstructorOptions());
      const error = 'some error';

      subscriber.error(error);

      expect(observer.complete).not.toHaveBeenCalled();
    });

    describeBehaviorOnDeactivation('error');
    describeBehaviorOnRepeatDeactivation('error');

    describe('При отсутствии error в наблюдателе', () => {
      it.each(casesWithoutErrorInObserver)(
        '$description, вызывается reportError с параметром, переданным в subscriber.error',
        ({ createObserverWithoutError }) => {
          const observer = createObserverWithoutError();
          const error = 'some error';
          const subscriber = new Subscriber(observer);

          subscriber.error(error);

          expect(reportError).toHaveBeenCalledExactlyOnceWith(error);
        }
      );
    });

    describe.each(getRepeatBehaviourCases('error'))('$description', ({ deactivate }) => {
      it('Не вызывает observer.error', () => {
        const observer = createMockedObserver();
        const controller = new AbortController();
        const subscriber = new Subscriber(observer, {
          ...getDefaultConstructorOptions(),
          signal: controller.signal,
        });

        deactivate(subscriber, controller);
        observer.error.mockClear();
        subscriber.error();

        expect(observer.error).not.toHaveBeenCalled();
      });
    });
  });
});
