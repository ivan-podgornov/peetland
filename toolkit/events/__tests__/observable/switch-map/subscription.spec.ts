import { describe, expect, it } from 'vitest';

import { AbortController } from '../../../src/abort-controller';

import {
  createControlledObservable,
  createMockedObserver,
  getDefaultObservableOptions,
  getDefaultSubscribeOptions,
} from '../helpers';

// Внутренний observable — тот, который вернул mapper

describe('Observable', () => {
  describe('#switchMap', () => {
    describe('Подписка и отписка', () => {
      it('Не подписывается на исходный observable, пока на результат никто не подписан', () => {
        const source = createControlledObservable();

        source.observable.switchMap(
          () => createControlledObservable().observable,
          getDefaultObservableOptions()
        );

        expect(source.executor).not.toHaveBeenCalled();
      });

      it('Если наблюдатель отписался, отписывается от исходного observable', () => {
        const controller = new AbortController();
        const source = createControlledObservable();

        source.observable
          .switchMap(() => createControlledObservable().observable, getDefaultObservableOptions())
          .subscribe(createMockedObserver(), {
            ...getDefaultSubscribeOptions(),
            signal: controller.signal,
          });
        controller.abort();

        expect(source.subscriber.active).toBe(false);
      });

      it('Если наблюдатель отписался, отписывается от внутреннего observable', () => {
        const controller = new AbortController();
        const source = createControlledObservable();
        const inner = createControlledObservable();

        source.observable
          .switchMap(() => inner.observable, getDefaultObservableOptions())
          .subscribe(createMockedObserver(), {
            ...getDefaultSubscribeOptions(),
            signal: controller.signal,
          });
        source.subscriber.next('value');
        controller.abort();

        expect(inner.subscriber.active).toBe(false);
      });
    });
  });
});
