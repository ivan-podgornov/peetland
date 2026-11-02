import { describe, expect, it } from 'vitest';

import { ManualTime } from '../../src';

describe('ManualTime', () => {
  describe('#constructor', () => {
    it('Если время не передано, время — полночь', () => {
      const time = new ManualTime();

      expect(time.minutesSinceMidnight).toBe(0);
    });

    it('Час равен переданному', () => {
      const time = new ManualTime(20, 15);

      expect(time.hours).toBe(20);
    });

    it('Минуты равны переданным', () => {
      const time = new ManualTime(20, 15);

      expect(time.minutes).toBe(15);
    });

    it('Если передан час не от 0 до 23, выбрасывает RangeError', () => {
      expect(() => new ManualTime(24, 0)).toThrow(RangeError);
    });

    it('Если переданы минуты не от 0 до 59, выбрасывает RangeError', () => {
      expect(() => new ManualTime(0, 60)).toThrow(RangeError);
    });
  });
});
