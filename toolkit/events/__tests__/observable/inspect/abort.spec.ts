import { describe, expect, it, vi } from 'vitest';

import { createControlledObservable, createMockedObserver } from '../../../dev';
import { AbortController } from '../../../src/abort-controller';

import { getDefaultSubscribeOptions } from '../helpers';

describe('Observable', () => {
  describe('#inspect', () => {
    describe('Колбэк abort', () => {
      it('Если наблюдатель отписался, вызывает inspector.abort с причиной отписки', () => {
        const controller = new AbortController();
        const source = createControlledObservable();
        const inspector = { abort: vi.fn() };

        source.observable.inspect(inspector).subscribe(createMockedObserver(), {
          ...getDefaultSubscribeOptions(),
          signal: controller.signal,
        });
        controller.abort('reason');

        expect(inspector.abort).toHaveBeenCalledExactlyOnceWith('reason');
      });

      it('Если наблюдатель отписался, отписывается от исходного observable', () => {
        const controller = new AbortController();
        const source = createControlledObservable();

        source.observable.inspect({ abort: vi.fn() }).subscribe(createMockedObserver(), {
          ...getDefaultSubscribeOptions(),
          signal: controller.signal,
        });
        controller.abort();

        expect(source.subscriber.active).toBe(false);
      });

      it('Если inspector.abort выбросил исключение, вызывает reportError', () => {
        const error = new Error('inspector error');
        const controller = new AbortController();
        const source = createControlledObservable();

        source.observable
          .inspect({ abort: vi.fn().mockThrow(error) })
          .subscribe(createMockedObserver(), {
            ...getDefaultSubscribeOptions(),
            signal: controller.signal,
          });
        controller.abort();

        expect(reportError).toHaveBeenCalledExactlyOnceWith(error);
      });
    });
  });
});
