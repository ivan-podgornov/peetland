import { describe, expect, it } from 'vitest';

import { ManualClock } from '../../src';

describe('ManualClock', () => {
  describe('#set', () => {
    it('Часы показывают выставленные часы', () => {
      const clock = new ManualClock();

      clock.set(8, 30);

      expect(clock.hours).toBe(8);
    });

    it('Часы показывают выставленные минуты', () => {
      const clock = new ManualClock();

      clock.set(8, 30);

      expect(clock.minutes).toBe(30);
    });

    it('Если часы меньше 0, выбрасывает RangeError', () => {
      const clock = new ManualClock();

      expect(() => clock.set(-1, 0)).toThrow(RangeError);
    });

    it('Если часы больше 23, выбрасывает RangeError', () => {
      const clock = new ManualClock();

      expect(() => clock.set(24, 0)).toThrow(RangeError);
    });

    it('Если часы не целые, выбрасывает RangeError', () => {
      const clock = new ManualClock();

      expect(() => clock.set(8.5, 0)).toThrow(RangeError);
    });

    it('Если минуты меньше 0, выбрасывает RangeError', () => {
      const clock = new ManualClock();

      expect(() => clock.set(0, -1)).toThrow(RangeError);
    });

    it('Если минуты больше 59, выбрасывает RangeError', () => {
      const clock = new ManualClock();

      expect(() => clock.set(0, 60)).toThrow(RangeError);
    });

    it('Если минуты не целые, выбрасывает RangeError', () => {
      const clock = new ManualClock();

      expect(() => clock.set(0, 0.5)).toThrow(RangeError);
    });

    it('Если время не выставлено из-за ошибки, часы показывают прежнее время', () => {
      const clock = new ManualClock(8, 30);

      expect(() => clock.set(24, 0)).toThrow(RangeError);
      expect(clock.minutesSinceMidnight).toBe(8 * 60 + 30);
    });
  });
});
