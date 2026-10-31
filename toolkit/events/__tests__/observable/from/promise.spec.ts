import { describe, expect, it } from 'vitest';

import { createMockedObserver, flushPromises } from '../../../dev';
import { Observable } from '../../../src/observable';

import { getDefaultSubscribeOptions } from '../helpers';

describe('Observable', () => {
  describe('.from', () => {
    describe('При передаче промиса', () => {
      it('Если промис выполнен, вызывает observer.next со значением промиса', async () => {
        const observable = Observable.from(Promise.resolve('value'));
        const observer = createMockedObserver();

        observable.subscribe(observer, getDefaultSubscribeOptions());
        await flushPromises();

        expect(observer.next).toHaveBeenCalledExactlyOnceWith('value');
      });

      it('Если промис выполнен, вызывает observer.complete после observer.next', async () => {
        const observable = Observable.from(Promise.resolve('value'));
        const observer = createMockedObserver();

        observable.subscribe(observer, getDefaultSubscribeOptions());
        await flushPromises();

        expect(observer.complete).toHaveBeenCalledExactlyOnceWith();
        expect(observer.complete).toHaveBeenCalledAfter(observer.next);
      });

      it('Даже если промис уже выполнен, не вызывает observer.next синхронно во время подписки', () => {
        const observable = Observable.from(Promise.resolve('value'));
        const observer = createMockedObserver();

        observable.subscribe(observer, getDefaultSubscribeOptions());

        expect(observer.next).not.toHaveBeenCalled();
      });

      it('Пока промис не завершён, не вызывает observer.next и observer.complete', async () => {
        const observable = Observable.from(new Promise(() => {}));
        const observer = createMockedObserver();

        observable.subscribe(observer, getDefaultSubscribeOptions());
        await flushPromises();

        expect(observer.next).not.toHaveBeenCalled();
        expect(observer.complete).not.toHaveBeenCalled();
      });

      it('Если промис отклонён, вызывает observer.error с причиной отклонения', async () => {
        const reason = new Error('promise rejected');
        const observable = Observable.from(Promise.reject(reason));
        const observer = createMockedObserver();

        observable.subscribe(observer, getDefaultSubscribeOptions());
        await flushPromises();

        expect(observer.error).toHaveBeenCalledExactlyOnceWith(reason);
      });

      it('Если промис отклонён, не вызывает observer.next и observer.complete', async () => {
        const observable = Observable.from(Promise.reject(new Error('promise rejected')));
        const observer = createMockedObserver();

        observable.subscribe(observer, getDefaultSubscribeOptions());
        await flushPromises();

        expect(observer.next).not.toHaveBeenCalled();
        expect(observer.complete).not.toHaveBeenCalled();
      });

      it('Если подписаться повторно после завершения, снова выдаёт значение промиса', async () => {
        const observable = Observable.from(Promise.resolve('value'));
        const observer = createMockedObserver();

        observable.subscribe(createMockedObserver(), getDefaultSubscribeOptions());
        await flushPromises();
        observable.subscribe(observer, getDefaultSubscribeOptions());
        await flushPromises();

        expect(observer.next).toHaveBeenCalledExactlyOnceWith('value');
      });
    });
  });
});
