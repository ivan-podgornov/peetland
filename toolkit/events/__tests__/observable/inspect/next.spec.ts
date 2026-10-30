import { describe, expect, it, vi } from 'vitest';

import { createControlledObservable, createMockedObserver } from '../../../dev';
import { getDefaultSubscribeOptions } from '../helpers';

describe('Observable', () => {
  describe('#inspect', () => {
    describe('Колбэк next', () => {
      it('Вызывает inspector.next со значением исходного observable', () => {
        const source = createControlledObservable();
        const inspector = { next: vi.fn() };

        source.observable
          .inspect(inspector)
          .subscribe(createMockedObserver(), getDefaultSubscribeOptions());
        source.subscriber.next('value');

        expect(inspector.next).toHaveBeenCalledExactlyOnceWith('value');
      });

      it('Если inspector передан функцией, вызывает её со значением исходного observable', () => {
        const source = createControlledObservable();
        const inspector = vi.fn();

        source.observable
          .inspect(inspector)
          .subscribe(createMockedObserver(), getDefaultSubscribeOptions());
        source.subscriber.next('value');

        expect(inspector).toHaveBeenCalledExactlyOnceWith('value');
      });

      it('Вызывает observer.next с тем же значением, которое выдал исходный observable', () => {
        const value = { key: 'value' };
        const source = createControlledObservable();
        const observer = createMockedObserver();

        source.observable
          .inspect({ next: vi.fn() })
          .subscribe(observer, getDefaultSubscribeOptions());
        source.subscriber.next(value);

        expect(observer.next).toHaveBeenCalledExactlyOnceWith(value);
      });

      it('Если inspector не передан, вызывает observer.next со значением исходного observable', () => {
        const source = createControlledObservable();
        const observer = createMockedObserver();

        source.observable.inspect().subscribe(observer, getDefaultSubscribeOptions());
        source.subscriber.next('value');

        expect(observer.next).toHaveBeenCalledExactlyOnceWith('value');
      });

      it('Вызывает inspector.next до observer.next', () => {
        const source = createControlledObservable();
        const inspector = { next: vi.fn() };
        const observer = createMockedObserver();

        source.observable.inspect(inspector).subscribe(observer, getDefaultSubscribeOptions());
        source.subscriber.next('value');

        expect(inspector.next).toHaveBeenCalledBefore(observer.next);
      });

      describe('При исключении в inspector.next', () => {
        it('Вызывает observer.error с этим исключением', () => {
          const error = new Error('inspector error');
          const source = createControlledObservable();
          const observer = createMockedObserver();

          source.observable
            .inspect({ next: vi.fn().mockThrow(error) })
            .subscribe(observer, getDefaultSubscribeOptions());
          source.subscriber.next('value');

          expect(observer.error).toHaveBeenCalledExactlyOnceWith(error);
        });

        it('Не вызывает observer.next', () => {
          const source = createControlledObservable();
          const observer = createMockedObserver();

          source.observable
            .inspect({ next: vi.fn().mockThrow(new Error('inspector error')) })
            .subscribe(observer, getDefaultSubscribeOptions());
          source.subscriber.next('value');

          expect(observer.next).not.toHaveBeenCalled();
        });

        it('Отписывается от исходного observable', () => {
          const source = createControlledObservable();

          source.observable
            .inspect({ next: vi.fn().mockThrow(new Error('inspector error')) })
            .subscribe(createMockedObserver(), getDefaultSubscribeOptions());
          source.subscriber.next('value');

          expect(source.subscriber.active).toBe(false);
        });

        it('Не вызывает inspector.abort', () => {
          const source = createControlledObservable();
          const inspector = {
            next: vi.fn().mockThrow(new Error('inspector error')),
            abort: vi.fn(),
          };

          source.observable
            .inspect(inspector)
            .subscribe(createMockedObserver(), getDefaultSubscribeOptions());
          source.subscriber.next('value');

          expect(inspector.abort).not.toHaveBeenCalled();
        });
      });
    });
  });
});
