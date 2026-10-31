import { describe, expect, it, vi } from 'vitest';

import { createControlledObservable, createMockedObserver } from '../../../dev';
import { getDefaultSubscribeOptions } from '../helpers';

describe('Observable', () => {
  describe('#subscribe', () => {
    describe('Взаимодействие с reportError', () => {
      it('Если ошибок не было, не вызывается', () => {
        const { observable, subscriber } = createControlledObservable();

        observable.subscribe(createMockedObserver(), getDefaultSubscribeOptions());
        subscriber.next('value');
        subscriber.complete();

        expect(reportError).not.toHaveBeenCalled();
      });

      it('Если teardown, добавленный в subscriber, выбрасывает ошибку, ошибка передаётся в reportError', () => {
        const error = new Error('teardown error');
        const { observable, subscriber } = createControlledObservable();

        observable.subscribe(createMockedObserver(), getDefaultSubscribeOptions());
        subscriber.addTeardown(vi.fn().mockThrow(error));
        subscriber.complete();

        expect(reportError).toHaveBeenCalledExactlyOnceWith(error);
      });
    });
  });
});
