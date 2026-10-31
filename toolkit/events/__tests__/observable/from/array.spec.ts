import { describe, expect, it, vi } from 'vitest';

import { createMockedObserver } from '../../../dev';
import { Observable } from '../../../src/observable';

import { getDefaultSubscribeOptions } from '../helpers';

describe('Observable', () => {
  describe('.from', () => {
    describe('При передаче массива', () => {
      it('Вызывает observer.next с каждым элементом массива в порядке следования', () => {
        const observable = Observable.from([1, 2]);
        const observer = createMockedObserver();

        observable.subscribe(observer, getDefaultSubscribeOptions());

        expect(observer.next).toHaveBeenNthCalledWith(1, 1);
        expect(observer.next).toHaveBeenNthCalledWith(2, 2);
      });

      it('Вызывает observer.complete после того, как выдал все элементы', () => {
        const observable = Observable.from([1, 2]);
        const observer = createMockedObserver();

        observable.subscribe(observer, getDefaultSubscribeOptions());

        expect(observer.complete).toHaveBeenCalledExactlyOnceWith();
        expect(observer.complete).toHaveBeenCalledAfter(observer.next);
      });

      it('Не вызывает observer.error', () => {
        const observable = Observable.from([1, 2]);
        const observer = createMockedObserver();

        observable.subscribe(observer, getDefaultSubscribeOptions());

        expect(observer.error).not.toHaveBeenCalled();
      });

      it('Если массив пуст, вызывает observer.complete и не вызывает observer.next', () => {
        const observable = Observable.from([]);
        const observer = createMockedObserver();

        observable.subscribe(observer, getDefaultSubscribeOptions());

        expect(observer.complete).toHaveBeenCalledExactlyOnceWith();
        expect(observer.next).not.toHaveBeenCalled();
      });

      it('Если массив изменён после вызова from, но до подписки, выдаёт элементы изменённого массива', () => {
        const values = [1];
        const observable = Observable.from(values);
        const observer = createMockedObserver();

        values.push(2);
        observable.subscribe(observer, getDefaultSubscribeOptions());

        expect(observer.next).toHaveBeenNthCalledWith(2, 2);
      });

      it('Если подписаться повторно после завершения, снова выдаёт все элементы', () => {
        const observable = Observable.from([1, 2]);
        const observer = createMockedObserver();

        observable.subscribe(createMockedObserver(), getDefaultSubscribeOptions());
        observable.subscribe(observer, getDefaultSubscribeOptions());

        expect(observer.next).toHaveBeenNthCalledWith(1, 1);
        expect(observer.next).toHaveBeenNthCalledWith(2, 2);
      });

      it('Если observer.next выбросил исключение, вызывает reportError', () => {
        const error = new Error('observer error');
        const observable = Observable.from([1]);
        const observer = {
          ...createMockedObserver(),
          next: vi.fn().mockThrow(error),
        };

        observable.subscribe(observer, getDefaultSubscribeOptions());

        expect(reportError).toHaveBeenCalledExactlyOnceWith(error);
      });
    });
  });
});
