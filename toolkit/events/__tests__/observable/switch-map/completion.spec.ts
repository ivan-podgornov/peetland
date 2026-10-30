import { describe, expect, it } from 'vitest';

import { createControlledObservable, createMockedObserver } from '../../../dev';
import { getDefaultSubscribeOptions } from '../helpers';

// Внутренний observable — тот, который вернул mapper

describe('Observable', () => {
  describe('#switchMap', () => {
    describe('Завершение', () => {
      it('Если внутренний observable завершился, а исходный нет, не вызывает observer.complete', () => {
        const source = createControlledObservable();
        const inner = createControlledObservable();
        const observer = createMockedObserver();

        source.observable
          .switchMap(() => inner.observable)
          .subscribe(observer, getDefaultSubscribeOptions());
        source.subscriber.next('value');
        inner.subscriber.complete();

        expect(observer.complete).not.toHaveBeenCalled();
      });

      it('Если исходный observable завершился, не выдав значений, вызывает observer.complete', () => {
        const source = createControlledObservable();
        const observer = createMockedObserver();

        source.observable
          .switchMap(() => createControlledObservable().observable)
          .subscribe(observer, getDefaultSubscribeOptions());
        source.subscriber.complete();

        expect(observer.complete).toHaveBeenCalledExactlyOnceWith();
      });

      it('Если исходный observable завершился после завершения внутреннего, вызывает observer.complete', () => {
        const source = createControlledObservable();
        const inner = createControlledObservable();
        const observer = createMockedObserver();

        source.observable
          .switchMap(() => inner.observable)
          .subscribe(observer, getDefaultSubscribeOptions());
        source.subscriber.next('value');
        inner.subscriber.complete();
        source.subscriber.complete();

        expect(observer.complete).toHaveBeenCalledExactlyOnceWith();
      });

      describe('При завершении исходного observable, пока внутренний ещё активен', () => {
        it('Не вызывает observer.complete', () => {
          const source = createControlledObservable();
          const inner = createControlledObservable();
          const observer = createMockedObserver();

          source.observable
            .switchMap(() => inner.observable)
            .subscribe(observer, getDefaultSubscribeOptions());
          source.subscriber.next('value');
          source.subscriber.complete();

          expect(observer.complete).not.toHaveBeenCalled();
        });

        it('Продолжает вызывать observer.next со значениями внутреннего observable', () => {
          const source = createControlledObservable();
          const inner = createControlledObservable();
          const observer = createMockedObserver();

          source.observable
            .switchMap(() => inner.observable)
            .subscribe(observer, getDefaultSubscribeOptions());
          source.subscriber.next('value');
          source.subscriber.complete();
          inner.subscriber.next('inner value');

          expect(observer.next).toHaveBeenCalledExactlyOnceWith('inner value');
        });

        it('Вызывает observer.complete, когда завершается внутренний observable', () => {
          const source = createControlledObservable();
          const inner = createControlledObservable();
          const observer = createMockedObserver();

          source.observable
            .switchMap(() => inner.observable)
            .subscribe(observer, getDefaultSubscribeOptions());
          source.subscriber.next('value');
          source.subscriber.complete();
          inner.subscriber.complete();

          expect(observer.complete).toHaveBeenCalledExactlyOnceWith();
        });
      });
    });
  });
});
