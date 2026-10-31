import { describe, expect, it, vi } from 'vitest';

import { createControlledObservable, createMockedObserver } from '../../../dev';
import { getDefaultSubscribeOptions } from '../helpers';

describe('Observable', () => {
  describe('#inspect', () => {
    describe('Колбэк error', () => {
      it('Если исходный observable выдал ошибку, вызывает inspector.error с этой ошибкой', () => {
        const error = new Error('source error');
        const source = createControlledObservable();
        const inspector = { error: vi.fn() };

        source.observable
          .inspect(inspector)
          .subscribe(createMockedObserver(), getDefaultSubscribeOptions());
        source.subscriber.error(error);

        expect(inspector.error).toHaveBeenCalledExactlyOnceWith(error);
      });

      it('Если исходный observable выдал ошибку, вызывает observer.error с этой ошибкой', () => {
        const error = new Error('source error');
        const source = createControlledObservable();
        const observer = createMockedObserver();

        source.observable
          .inspect({ error: vi.fn() })
          .subscribe(observer, getDefaultSubscribeOptions());
        source.subscriber.error(error);

        expect(observer.error).toHaveBeenCalledExactlyOnceWith(error);
      });

      it('Вызывает inspector.error до observer.error', () => {
        const source = createControlledObservable();
        const inspector = { error: vi.fn() };
        const observer = createMockedObserver();

        source.observable.inspect(inspector).subscribe(observer, getDefaultSubscribeOptions());
        source.subscriber.error(new Error('source error'));

        expect(inspector.error).toHaveBeenCalledBefore(observer.error);
      });

      it('Если исходный observable выдал ошибку, не вызывает inspector.abort', () => {
        const source = createControlledObservable();
        const inspector = { abort: vi.fn() };

        source.observable
          .inspect(inspector)
          .subscribe(createMockedObserver(), getDefaultSubscribeOptions());
        source.subscriber.error(new Error('source error'));

        expect(inspector.abort).not.toHaveBeenCalled();
      });

      it('Если inspector.error выбросил исключение, вызывает observer.error с исключением вместо ошибки исходного observable', () => {
        const inspectorError = new Error('inspector error');
        const source = createControlledObservable();
        const observer = createMockedObserver();

        source.observable
          .inspect({ error: vi.fn().mockThrow(inspectorError) })
          .subscribe(observer, getDefaultSubscribeOptions());
        source.subscriber.error(new Error('source error'));

        expect(observer.error).toHaveBeenCalledExactlyOnceWith(inspectorError);
      });
    });
  });
});
