import { describe, expect, it, vi } from 'vitest';

import { createControlledObservable, createMockedObserver } from '../../../dev';
import { getDefaultSubscribeOptions } from '../helpers';

describe('Observable', () => {
  describe('#subscribe', () => {
    describe('При ошибке в обработчиках наблюдателя', () => {
      it('Если в observer.next происходит ошибка, вызывает reportError с этой ошибкой', () => {
        const error = new Error('next failed');
        const { observable, subscriber } = createControlledObservable();
        const observer = { ...createMockedObserver(), next: vi.fn().mockThrow(error) };

        observable.subscribe(observer, getDefaultSubscribeOptions());
        subscriber.next('value');

        expect(reportError).toHaveBeenCalledExactlyOnceWith(error);
      });

      it('Если в одном из observer.next происходит ошибка, остальные наблюдатели всё равно продолжают получать событие', () => {
        const error = new Error('next failed');
        const { observable, subscriber } = createControlledObservable();
        const failedObserver = { ...createMockedObserver(), next: vi.fn().mockThrow(error) };
        const otherObserver = createMockedObserver();

        observable.subscribe(failedObserver, getDefaultSubscribeOptions());
        observable.subscribe(otherObserver, getDefaultSubscribeOptions());
        subscriber.next('value');

        expect(otherObserver.next).toHaveBeenCalledExactlyOnceWith('value');
      });

      it('Если в observer.error происходит ошибка, вызывает reportError с этой ошибкой', () => {
        const error = new Error('error failed');
        const { observable, subscriber } = createControlledObservable();
        const observer = { ...createMockedObserver(), error: vi.fn().mockThrow(error) };

        observable.subscribe(observer, getDefaultSubscribeOptions());
        subscriber.error('other error');

        expect(reportError).toHaveBeenCalledExactlyOnceWith(error);
      });

      it('Если в observer.complete происходит ошибка, вызывает reportError с этой ошибкой', () => {
        const error = new Error('complete failed');
        const { observable, subscriber } = createControlledObservable();
        const observer = { ...createMockedObserver(), complete: vi.fn().mockThrow(error) };

        observable.subscribe(observer, getDefaultSubscribeOptions());
        subscriber.complete();

        expect(reportError).toHaveBeenCalledExactlyOnceWith(error);
      });
    });
  });
});
