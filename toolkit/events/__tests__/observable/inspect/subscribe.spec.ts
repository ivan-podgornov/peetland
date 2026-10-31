import { describe, expect, it, vi } from 'vitest';

import { createControlledObservable, createMockedObserver } from '../../../dev';
import { getDefaultSubscribeOptions } from '../helpers';

describe('Observable', () => {
  describe('#inspect', () => {
    describe('Колбэк subscribe', () => {
      it('Не вызывает inspector.subscribe, пока на результат никто не подписан', () => {
        const source = createControlledObservable();
        const inspector = { subscribe: vi.fn() };

        source.observable.inspect(inspector);

        expect(inspector.subscribe).not.toHaveBeenCalled();
      });

      it('При подписке на результат вызывает inspector.subscribe', () => {
        const source = createControlledObservable();
        const inspector = { subscribe: vi.fn() };

        source.observable
          .inspect(inspector)
          .subscribe(createMockedObserver(), getDefaultSubscribeOptions());

        expect(inspector.subscribe).toHaveBeenCalledExactlyOnceWith();
      });

      it('Вызывает inspector.subscribe до подписки на исходный observable', () => {
        const source = createControlledObservable();
        const inspector = { subscribe: vi.fn() };

        source.observable
          .inspect(inspector)
          .subscribe(createMockedObserver(), getDefaultSubscribeOptions());

        expect(inspector.subscribe).toHaveBeenCalledBefore(source.executor);
      });

      it('Если inspector.subscribe выбросил исключение, вызывает observer.error с этим исключением', () => {
        const error = new Error('inspector error');
        const source = createControlledObservable();
        const observer = createMockedObserver();

        source.observable
          .inspect({ subscribe: vi.fn().mockThrow(error) })
          .subscribe(observer, getDefaultSubscribeOptions());

        expect(observer.error).toHaveBeenCalledExactlyOnceWith(error);
      });

      it('Если inspector.subscribe выбросил исключение, не подписывается на исходный observable', () => {
        const source = createControlledObservable();

        source.observable
          .inspect({ subscribe: vi.fn().mockThrow(new Error('inspector error')) })
          .subscribe(createMockedObserver(), getDefaultSubscribeOptions());

        expect(source.executor).not.toHaveBeenCalled();
      });
    });
  });
});
