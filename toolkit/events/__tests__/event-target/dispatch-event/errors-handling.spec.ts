import { describe, expect, it, vi } from 'vitest';

import { EventTarget } from '../../../src/event-target';
import type { TestEvents } from '../helpers';

describe('EventTarget', () => {
  describe('#dispatchEvent', () => {
    describe('При исключении в обработчике', () => {
      it('Не пробрасывает исключение наружу', () => {
        const target = new EventTarget<TestEvents>();
        target.addEventListener('tick', () => {
          throw new Error('boom');
        });

        expect(() => target.dispatchEvent('tick')).not.toThrow();
      });

      it('Вызывает обработчики, назначенные после упавшего', () => {
        const target = new EventTarget<TestEvents>();
        const next = vi.fn();
        target.addEventListener('tick', () => {
          throw new Error('boom');
        });
        target.addEventListener('tick', next);

        target.dispatchEvent('tick');

        expect(next).toHaveBeenCalledOnce();
      });

      it('Не снимает упавший обработчик, он вызывается при следующем порождении события', () => {
        const target = new EventTarget<TestEvents>();
        const failing = vi.fn(() => {
          throw new Error('boom');
        });
        target.addEventListener('tick', failing);

        target.dispatchEvent('tick');
        target.dispatchEvent('tick');

        expect(failing).toHaveBeenCalledTimes(2);
      });

      it('Передаёт выброшенное исключение в reportError', () => {
        const error = new Error('boom');
        const target = new EventTarget<TestEvents>();
        target.addEventListener('tick', () => {
          throw error;
        });

        target.dispatchEvent('tick');

        expect(reportError).toHaveBeenCalledExactlyOnceWith(error);
      });

      it('Если упали несколько обработчиков, передаёт в reportError исключение каждого', () => {
        const first = new Error('first');
        const second = new Error('second');
        const target = new EventTarget<TestEvents>();
        target.addEventListener('tick', () => {
          throw first;
        });
        target.addEventListener('tick', () => {
          throw second;
        });

        target.dispatchEvent('tick');

        expect(vi.mocked(reportError).mock.calls).toEqual([[first], [second]]);
      });
    });
  });
});
