import { describe, expect, it, vi } from 'vitest';

import {
  getDefaultConstructorOptions,
  getCasesAfterDeactivation,
  getCasesWithObserverNext,
} from '../../../dev';
import { AbortController } from '../../../src/abort-controller';
import { Subscriber } from '../../../src/subscriber';

describe('Subscriber', () => {
  describe('#next', () => {
    describe.each(getCasesAfterDeactivation())('$description', ({ deactivate }) => {
      it.each(getCasesWithObserverNext())(
        '$description, вызов subscriber.next() не выбрасывает ошибку',
        ({ createObserver }) => {
          const controller = new AbortController();
          const observer = createObserver(() => {});
          const subscriber = new Subscriber(observer, {
            ...getDefaultConstructorOptions(),
            signal: controller.signal,
          });

          deactivate(subscriber, controller);

          expect(() => subscriber.next('any value')).not.toThrow();
        }
      );

      it.each(getCasesWithObserverNext())(
        '$description, вызов subscriber.next() не вызывает $nextName',
        ({ createObserver }) => {
          const controller = new AbortController();
          const next = vi.fn();
          const observer = createObserver(next);
          const subscriber = new Subscriber(observer, {
            ...getDefaultConstructorOptions(),
            signal: controller.signal,
          });

          deactivate(subscriber, controller);
          subscriber.next('any value');

          expect(next).not.toHaveBeenCalled();
        }
      );
    });
  });
});
