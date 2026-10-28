import { AbortController } from '@peetland/events';
import { describe, expect, it, vi } from 'vitest';

import { Timer } from '../src';

describe('Timer', () => {
  describe('#interval', () => {
    it('Раз в period миллисекунд сообщает, что прошло period миллисекунд', () => {
      vi.useFakeTimers();
      const timer = new Timer();
      const next = vi.fn();

      timer.interval(1000).subscribe({ next });
      vi.advanceTimersByTime(2000);

      expect(next.mock.calls).toStrictEqual([[1000], [1000]]);
    });

    it('Ничего не сообщает, пока не прошёл period', () => {
      vi.useFakeTimers();
      const timer = new Timer();
      const next = vi.fn();

      timer.interval(1000).subscribe({ next });
      vi.advanceTimersByTime(999);

      expect(next).not.toHaveBeenCalled();
    });

    it('Отсчитывает время каждого интервала от подписки на него', () => {
      vi.useFakeTimers();
      const timer = new Timer();
      const next = vi.fn();
      timer.interval(1000).subscribe();

      vi.advanceTimersByTime(500);
      timer.interval(1000).subscribe({ next });
      vi.advanceTimersByTime(500);

      expect(next).not.toHaveBeenCalled();
    });

    it('Если наблюдатель отписался, больше ему ничего не сообщает', () => {
      vi.useFakeTimers();
      const timer = new Timer();
      const next = vi.fn();
      const controller = new AbortController();

      timer.interval(1000).subscribe({ next }, { signal: controller.signal });
      controller.abort();
      vi.advanceTimersByTime(1000);

      expect(next).not.toHaveBeenCalled();
    });
  });
});
