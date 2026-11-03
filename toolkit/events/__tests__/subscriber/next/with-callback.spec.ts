import { describe, expect, it, vi } from 'vitest';

import {
  createMockedObserver,
  getDefaultConstructorOptions,
  getCasesWithObserverNext,
} from '../../../dev';
import { Subscriber } from '../../../src/subscriber';

describe('Subscriber', () => {
  describe('#next', () => {
    describe('При заданном колбэке next', () => {
      it.each(getCasesWithObserverNext())(
        '$description, вызывает $nextName с тем же параметром, с которым вызван subscriber.next',
        ({ createObserver }) => {
          const next = vi.fn();
          const observer = createObserver(next);
          const value = 1;
          const subscriber = new Subscriber(observer, getDefaultConstructorOptions());

          subscriber.next(value);

          expect(next).toHaveBeenCalledExactlyOnceWith(value);
        }
      );

      it.each(getCasesWithObserverNext())(
        '$description, вызывает $nextName один раз на каждый вызов метода',
        ({ createObserver }) => {
          const next = vi.fn();
          const observer = createObserver(next);
          const firstValue = 'first value';
          const secondValue = 'second value';
          const subscriber = new Subscriber(observer, getDefaultConstructorOptions());

          subscriber.next(firstValue);
          subscriber.next(secondValue);

          expect(next).toHaveBeenCalledTimes(2);
          expect(next).toHaveBeenNthCalledWith(1, 'first value');
          expect(next).toHaveBeenNthCalledWith(2, 'second value');
        }
      );

      it.each(getCasesWithObserverNext())(
        '$description и $nextName выбрасывает ошибку - это не приводит к ошибке при вызове subscriber.next',
        ({ createObserver }) => {
          const next = vi.fn().mockThrow('some error');
          const observer = createObserver(next);
          const subscriber = new Subscriber(observer, getDefaultConstructorOptions());

          expect(() => subscriber.next('some value')).not.toThrow();
        }
      );

      it('Если observer задан в виде объекта с методами next и error, ошибка в observer.next не приводит к вызову observer.error', () => {
        const observer = {
          ...createMockedObserver(),
          next: vi.fn().mockThrow('some error'),
        };
        const subscriber = new Subscriber(observer, getDefaultConstructorOptions());

        subscriber.next('any value');

        expect(observer.error).not.toHaveBeenCalled();
      });

      it.each(getCasesWithObserverNext())(
        '$description и $nextName выбрасывает ошибку, подписка продолжает находиться в активном состоянии',
        ({ createObserver }) => {
          const next = vi.fn().mockThrow('some error');
          const observer = createObserver(next);
          const subscriber = new Subscriber(observer, getDefaultConstructorOptions());

          subscriber.next('any value');

          expect(subscriber.active).toBe(true);
        }
      );

      it.each(getCasesWithObserverNext())(
        '$description и $nextName выбрасывает ошибку, сигнал подписки продолжает находиться в pending состоянии',
        ({ createObserver }) => {
          const next = vi.fn().mockThrow('some error');
          const observer = createObserver(next);
          const subscriber = new Subscriber(observer, getDefaultConstructorOptions());

          subscriber.next('any value');

          expect(subscriber.signal.aborted).toBe(false);
        }
      );

      it.each(getCasesWithObserverNext())(
        '$description, $nextName выбрасывает ошибку, вызывается reportError с ошибкой, которую выбросил $nextName',
        ({ createObserver }) => {
          const error = 'some error';
          const next = vi.fn().mockThrow(error);
          const observer = createObserver(next);
          const subscriber = new Subscriber(observer);

          subscriber.next('some value');

          expect(reportError).toHaveBeenCalledWith(error);
        }
      );
    });
  });
});
