import { describe, expect, it, vi } from 'vitest';

import {
  createControlledObservable,
  createMockedObserver,
  getDefaultSubscribeOptions,
} from '../../../../dev';
import { AbortSignal } from '../../../../src/abort-signal';
import { Observable } from '../../../../src/observable';
import type { ISubscriber } from '../../../../src/subscriber';

describe('Observable', () => {
  describe('#subscribe', () => {
    describe('При первом подключении с сигналом который уже в состоянии aborted', () => {
      it('Всё равно вызывает callback-executor', () => {
        const executor = vi.fn();
        const observable = new Observable(executor);

        observable.subscribe(createMockedObserver(), {
          ...getDefaultSubscribeOptions(),
          signal: AbortSignal.abort(),
        });

        expect(executor).toHaveBeenCalled();
      });

      it('Subscriber, переданный в колбэк-executor, неактивен', () => {
        const executor = vi
          .fn()
          .mockImplementation((subscriber: ISubscriber<unknown>) => subscriber.active);
        const observable = new Observable(executor);

        observable.subscribe(createMockedObserver(), {
          ...getDefaultSubscribeOptions(),
          signal: AbortSignal.abort(),
        });

        expect(executor).toHaveReturnedWith(false);
      });

      it('Наблюдатель не получает значения', () => {
        const { observable, subscriber } = createControlledObservable();
        const observer = createMockedObserver();

        observable.subscribe(observer, { signal: AbortSignal.abort() });
        subscriber.next('value');

        expect(observer.next).not.toHaveBeenCalled();
      });
    });
  });
});
