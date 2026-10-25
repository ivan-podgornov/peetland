import { describe, expect, it, vi } from 'vitest';

import {
  createControlledObservable,
  createMockedObserver,
  getDefaultObservableOptions,
  getDefaultSubscribeOptions,
} from '../helpers';

describe('Observable', () => {
  describe('#switchMap', () => {
    describe('Опции', () => {
      it('Если observer.next выбросил исключение, вызывает onError, переданный во втором параметре switchMap', () => {
        const error = new Error('observer error');
        const onError = vi.fn();
        const source = createControlledObservable();
        const inner = createControlledObservable();
        const observer = {
          ...createMockedObserver(),
          next: vi.fn().mockThrow(error),
        };

        source.observable
          .switchMap(() => inner.observable, {
            ...getDefaultObservableOptions(),
            onError,
          })
          .subscribe(observer, getDefaultSubscribeOptions());
        source.subscriber.next('value');
        inner.subscriber.next('inner value');

        expect(onError).toHaveBeenCalledExactlyOnceWith(error);
      });
    });
  });
});
