import { describe, expect, it, vi } from 'vitest';

import { ManualTimer } from '../../src';

describe('ManualTimer', () => {
  describe('#interval', () => {
    it('Ничего не сообщает, пока время не продвинули', () => {
      const timer = new ManualTimer();
      const next = vi.fn();

      timer.interval(1000).subscribe({ next });

      expect(next).not.toHaveBeenCalled();
    });

    it('Если period равен нулю, выбрасывает RangeError', () => {
      const timer = new ManualTimer();

      expect(() => timer.interval(0)).toThrow(RangeError);
    });

    it('Если period отрицательный, выбрасывает RangeError', () => {
      const timer = new ManualTimer();

      expect(() => timer.interval(-1)).toThrow(RangeError);
    });

    it('Если period равен Infinity, выбрасывает RangeError', () => {
      const timer = new ManualTimer();

      expect(() => timer.interval(Infinity)).toThrow(RangeError);
    });
  });
});
