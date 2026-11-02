import { describe, expect, it } from 'vitest';

import { ManualClock } from '../../src';

describe('ManualClock', () => {
  describe('#constructor', () => {
    it('Если время не передано, часы показывают полночь', () => {
      const clock = new ManualClock();

      expect(clock.minutesSinceMidnight).toBe(0);
    });

    it('Часы показывают переданные часы', () => {
      const clock = new ManualClock(20, 15);

      expect(clock.hours).toBe(20);
    });

    it('Часы показывают переданные минуты', () => {
      const clock = new ManualClock(20, 15);

      expect(clock.minutes).toBe(15);
    });

    it('Если переданы часы не от 0 до 23, выбрасывает RangeError', () => {
      expect(() => new ManualClock(24, 0)).toThrow(RangeError);
    });

    it('Если переданы минуты не от 0 до 59, выбрасывает RangeError', () => {
      expect(() => new ManualClock(0, 60)).toThrow(RangeError);
    });
  });
});
