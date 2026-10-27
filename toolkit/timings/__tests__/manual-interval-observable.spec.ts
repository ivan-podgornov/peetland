import { AbortController } from '@peetland/events';
import { describe, expect, it, vi } from 'vitest';

import { ManualIntervalObservable } from '../src';

describe('ManualIntervalObservable', () => {
  describe('#tick', () => {
    it('Сообщает наблюдателю переданное время', () => {
      const interval = new ManualIntervalObservable();
      const next = vi.fn();
      interval.subscribe({ next });

      interval.tick(500);

      expect(next).toHaveBeenCalledExactlyOnceWith(500);
    });

    it('Сообщает время всем наблюдателям', () => {
      const interval = new ManualIntervalObservable();
      const first = vi.fn();
      const second = vi.fn();
      interval.subscribe({ next: first });
      interval.subscribe({ next: second });

      interval.tick(500);

      expect(second).toHaveBeenCalledExactlyOnceWith(500);
    });

    it('Если наблюдатель отписался, ничего ему не сообщает', () => {
      const interval = new ManualIntervalObservable();
      const next = vi.fn();
      const controller = new AbortController();
      interval.subscribe({ next }, { signal: controller.signal });
      controller.abort();

      interval.tick(500);

      expect(next).not.toHaveBeenCalled();
    });

    it('Если все наблюдатели отписались, сообщает время тем, кто подписался после', () => {
      const interval = new ManualIntervalObservable();
      const controller = new AbortController();
      const next = vi.fn();
      interval.subscribe({}, { signal: controller.signal });
      controller.abort();
      interval.subscribe({ next });

      interval.tick(500);

      expect(next).toHaveBeenCalledExactlyOnceWith(500);
    });
  });
});
