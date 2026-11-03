import { describe, expect, it, vi } from 'vitest';

import { createMockedObserver, getDefaultConstructorOptions } from '../../../dev';
import { Subscriber } from '../../../src/subscriber/subscriber';

describe('Subscriber', () => {
  describe('#error', () => {
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
        const observer = {
          ...createMockedObserver(),
          error: throwsError,
        };
        const subscriber = new Subscriber(observer, getDefaultConstructorOptions());

        expect(() => subscriber.error()).not.toThrow();
      });

      it('Если observer.error выбрасывает ошибку, вызывается reportError с ошибкой, которую выбросил observer.error', () => {
        const error = new Error();
        const throwsError = vi.fn().mockThrow(error);
        const observer = {
          ...createMockedObserver(),
          error: throwsError,
        };
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
  });
});
