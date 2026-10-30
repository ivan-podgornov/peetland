import { describe, expect, it, vi } from 'vitest';

import { createControlledObservable, createMockedObserver } from '../../../dev';
import { getDefaultSubscribeOptions } from '../helpers';

describe('Observable', () => {
  describe('#inspect', () => {
    describe('Колбэк complete', () => {
      it('Если исходный observable завершился, вызывает inspector.complete', () => {
        const source = createControlledObservable();
        const inspector = { complete: vi.fn() };

        source.observable
          .inspect(inspector)
          .subscribe(createMockedObserver(), getDefaultSubscribeOptions());
        source.subscriber.complete();

        expect(inspector.complete).toHaveBeenCalledExactlyOnceWith();
      });

      it('Если исходный observable завершился, вызывает observer.complete', () => {
        const source = createControlledObservable();
        const observer = createMockedObserver();

        source.observable
          .inspect({ complete: vi.fn() })
          .subscribe(observer, getDefaultSubscribeOptions());
        source.subscriber.complete();

        expect(observer.complete).toHaveBeenCalledExactlyOnceWith();
      });

      it('Вызывает inspector.complete до observer.complete', () => {
        const source = createControlledObservable();
        const inspector = { complete: vi.fn() };
        const observer = createMockedObserver();

        source.observable.inspect(inspector).subscribe(observer, getDefaultSubscribeOptions());
        source.subscriber.complete();

        expect(inspector.complete).toHaveBeenCalledBefore(observer.complete);
      });

      it('Если исходный observable завершился, не вызывает inspector.abort', () => {
        const source = createControlledObservable();
        const inspector = { abort: vi.fn() };

        source.observable
          .inspect(inspector)
          .subscribe(createMockedObserver(), getDefaultSubscribeOptions());
        source.subscriber.complete();

        expect(inspector.abort).not.toHaveBeenCalled();
      });

      describe('При исключении в inspector.complete', () => {
        it('Вызывает observer.error с этим исключением', () => {
          const error = new Error('inspector error');
          const source = createControlledObservable();
          const observer = createMockedObserver();

          source.observable
            .inspect({ complete: vi.fn().mockThrow(error) })
            .subscribe(observer, getDefaultSubscribeOptions());
          source.subscriber.complete();

          expect(observer.error).toHaveBeenCalledExactlyOnceWith(error);
        });

        it('Не вызывает observer.complete', () => {
          const source = createControlledObservable();
          const observer = createMockedObserver();

          source.observable
            .inspect({ complete: vi.fn().mockThrow(new Error('inspector error')) })
            .subscribe(observer, getDefaultSubscribeOptions());
          source.subscriber.complete();

          expect(observer.complete).not.toHaveBeenCalled();
        });
      });
    });
  });
});
