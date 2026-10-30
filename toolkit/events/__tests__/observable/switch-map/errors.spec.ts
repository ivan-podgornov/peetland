import { describe, expect, it } from 'vitest';

import { createControlledObservable, createMockedObserver } from '../../../dev';
import { getDefaultSubscribeOptions } from '../helpers';

// Внутренний observable — тот, который вернул mapper

describe('Observable', () => {
  describe('#switchMap', () => {
    describe('Ошибки', () => {
      it('Если исходный observable выдал ошибку, вызывает observer.error с этой ошибкой', () => {
        const error = new Error('source error');
        const source = createControlledObservable();
        const observer = createMockedObserver();

        source.observable
          .switchMap(() => createControlledObservable().observable)
          .subscribe(observer, getDefaultSubscribeOptions());
        source.subscriber.error(error);

        expect(observer.error).toHaveBeenCalledExactlyOnceWith(error);
      });

      it('Если исходный observable выдал ошибку, отписывается от внутреннего observable', () => {
        const source = createControlledObservable();
        const inner = createControlledObservable();

        source.observable
          .switchMap(() => inner.observable)
          .subscribe(createMockedObserver(), getDefaultSubscribeOptions());
        source.subscriber.next('value');
        source.subscriber.error(new Error('source error'));

        expect(inner.subscriber.active).toBe(false);
      });

      it('Если внутренний observable выдал ошибку, вызывает observer.error с этой ошибкой', () => {
        const error = new Error('inner error');
        const source = createControlledObservable();
        const inner = createControlledObservable();
        const observer = createMockedObserver();

        source.observable
          .switchMap(() => inner.observable)
          .subscribe(observer, getDefaultSubscribeOptions());
        source.subscriber.next('value');
        inner.subscriber.error(error);

        expect(observer.error).toHaveBeenCalledExactlyOnceWith(error);
      });

      it('Если внутренний observable выдал ошибку, отписывается от исходного observable', () => {
        const source = createControlledObservable();
        const inner = createControlledObservable();

        source.observable
          .switchMap(() => inner.observable)
          .subscribe(createMockedObserver(), getDefaultSubscribeOptions());
        source.subscriber.next('value');
        inner.subscriber.error(new Error('inner error'));

        expect(source.subscriber.active).toBe(false);
      });
    });
  });
});
