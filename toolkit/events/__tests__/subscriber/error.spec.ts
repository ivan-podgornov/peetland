import { describe, expect, it, vi } from 'vitest';

import { createMockedObserver } from '../../dev';
import { AbortController } from '../../src/abort-controller';
import { Subscriber } from '../../src/subscriber/subscriber';

import { describeBehaviorOnDeactivation } from './describe-behavior-on-deactivation';
import {
  describeBehaviorOnRepeatDeactivation,
  getRepeatBehaviourCases,
} from './describe-behaviour-on-repeat-deactivation';
import { getDefaultConstructorOptions } from './helpers';

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

    describe('Если observer указан в виде объекта с методом error', () => {
      it('Вызывает observer.error с параметром переданным в subscriber.error', () => {
        const observer = createMockedObserver();
        const subscriber = new Subscriber(observer, getDefaultConstructorOptions());
        const error = 'some error';

        subscriber.error(error);

        expect(observer.error).toHaveBeenCalledExactlyOnceWith(error);
      });

      it('Вызывает добавленные с помощью addTeardown колбэки до вызова observer.error', () => {
        const observer = createMockedObserver();
        const subscriber = new Subscriber(observer, getDefaultConstructorOptions());
        const callback = vi.fn();

        subscriber.addTeardown(callback);
        subscriber.error();

        expect(callback).toHaveBeenCalledBefore(observer.error);
      });

      it('Если один из teardown-колбэков выбрасывает ошибку, всё равно вызывает observer.error', () => {
        const throwsErrorCallback = vi.fn().mockThrow(new Error());
        const observer = createMockedObserver();
        const subscriber = new Subscriber(observer, getDefaultConstructorOptions());

        subscriber.addTeardown(throwsErrorCallback);
        subscriber.error();

        expect(observer.error).toHaveBeenCalled();
      });

      it('Если observer.error выбрасывает ошибку, она не выбрасывается из метода subscriber.error', () => {
        const throwsError = vi.fn().mockThrow(new Error());
        const observer = { ...createMockedObserver(), error: throwsError };
        const subscriber = new Subscriber(observer, getDefaultConstructorOptions());

        expect(() => subscriber.error()).not.toThrow();
      });

      it('Если observer.error выбрасывает ошибку, вызывается reportError с ошибкой, которую выбросил observer.error', () => {
        const error = new Error();
        const throwsError = vi.fn().mockThrow(error);
        const observer = { ...createMockedObserver(), error: throwsError };
        const subscriber = new Subscriber(observer);

        subscriber.error();

        expect(reportError).toHaveBeenCalledWith(error);
      });

      it('Не вызывает reportError: ошибка обрабатывается в observer.error', () => {
        const subscriber = new Subscriber(createMockedObserver());

        subscriber.error();

        expect(reportError).not.toHaveBeenCalled();
      });
    });

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
