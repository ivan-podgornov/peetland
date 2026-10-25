import { describe, expect, it, vi } from 'vitest';

import {
  createControlledObservable,
  createMockedObserver,
  getDefaultObservableOptions,
  getDefaultSubscribeOptions,
} from '../helpers';

// Внутренний observable — тот, который вернул mapper

describe('Observable', () => {
  describe('#switchMap', () => {
    describe('Переключение между внутренними observable', () => {
      it('Подписывается на внутренний observable синхронно, при получении значения', () => {
        const source = createControlledObservable();
        const inner = createControlledObservable();

        source.observable
          .switchMap(() => inner.observable, getDefaultObservableOptions())
          .subscribe(createMockedObserver(), getDefaultSubscribeOptions());
        source.subscriber.next('value');

        expect(inner.executor).toHaveBeenCalledOnce();
      });

      it('Вызывает observer.next со значениями внутреннего observable', () => {
        const source = createControlledObservable();
        const inner = createControlledObservable();
        const observer = createMockedObserver();

        source.observable
          .switchMap(() => inner.observable, getDefaultObservableOptions())
          .subscribe(observer, getDefaultSubscribeOptions());
        source.subscriber.next('value');
        inner.subscriber.next('inner value');

        expect(observer.next).toHaveBeenCalledExactlyOnceWith('inner value');
      });

      it('Если исходный observable выдал новое значение, отписывается от предыдущего внутреннего observable', () => {
        const source = createControlledObservable();
        const first = createControlledObservable();
        const mapper = vi
          .fn()
          .mockReturnValueOnce(first.observable)
          .mockReturnValueOnce(createControlledObservable().observable);

        source.observable
          .switchMap(mapper, getDefaultObservableOptions())
          .subscribe(createMockedObserver(), getDefaultSubscribeOptions());
        source.subscriber.next('first value');
        source.subscriber.next('second value');

        expect(first.subscriber.active).toBe(false);
      });

      it('Отписывается от предыдущего внутреннего observable до вызова mapper с новым значением', () => {
        const source = createControlledObservable();
        const first = createControlledObservable();
        let firstActiveWhenMapped: boolean | null = null;
        const mapper = vi
          .fn()
          .mockReturnValueOnce(first.observable)
          .mockImplementationOnce(() => {
            firstActiveWhenMapped = first.subscriber.active;
            return createControlledObservable().observable;
          });

        source.observable
          .switchMap(mapper, getDefaultObservableOptions())
          .subscribe(createMockedObserver(), getDefaultSubscribeOptions());
        source.subscriber.next('first value');
        source.subscriber.next('second value');

        expect(firstActiveWhenMapped).toBe(false);
      });

      it('Если исходный observable выдал новое значение, вызывает observer.next со значениями нового внутреннего observable', () => {
        const source = createControlledObservable();
        const second = createControlledObservable();
        const observer = createMockedObserver();
        const mapper = vi
          .fn()
          .mockReturnValueOnce(createControlledObservable().observable)
          .mockReturnValueOnce(second.observable);

        source.observable
          .switchMap(mapper, getDefaultObservableOptions())
          .subscribe(observer, getDefaultSubscribeOptions());
        source.subscriber.next('first value');
        source.subscriber.next('second value');
        second.subscriber.next('second inner value');

        expect(observer.next).toHaveBeenCalledExactlyOnceWith('second inner value');
      });
    });
  });
});
