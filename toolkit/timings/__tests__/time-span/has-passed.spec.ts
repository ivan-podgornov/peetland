import { describe, expect, it } from 'vitest';

import { TimeSpan } from '../../src';

describe('TimeSpan', () => {
  describe('#hasPassed', () => {
    it('Если от from до to прошло больше minutes минут, возвращает true', () => {
      const span = new TimeSpan();

      const passed = span.hasPassed(
        {
          day: 1,
          hours: 10,
          minutes: 0,
        },
        {
          day: 1,
          hours: 10,
          minutes: 20,
        },
        15
      );

      expect(passed).toBe(true);
    });

    it('Если от from до to прошло ровно minutes минут, возвращает true', () => {
      const span = new TimeSpan();

      const passed = span.hasPassed(
        {
          day: 1,
          hours: 10,
          minutes: 0,
        },
        {
          day: 1,
          hours: 10,
          minutes: 15,
        },
        15
      );

      expect(passed).toBe(true);
    });

    it('Если от from до to прошло меньше minutes минут, возвращает false', () => {
      const span = new TimeSpan();

      const passed = span.hasPassed(
        {
          day: 1,
          hours: 10,
          minutes: 0,
        },
        {
          day: 1,
          hours: 10,
          minutes: 14,
        },
        15
      );

      expect(passed).toBe(false);
    });

    it('Если minutes минут прошло через полночь, возвращает true', () => {
      const span = new TimeSpan();

      const passed = span.hasPassed(
        {
          day: 1,
          hours: 23,
          minutes: 50,
        },
        {
          day: 2,
          hours: 0,
          minutes: 5,
        },
        15
      );

      expect(passed).toBe(true);
    });

    it('Если to раньше from, возвращает false', () => {
      const span = new TimeSpan();

      const passed = span.hasPassed(
        {
          day: 1,
          hours: 10,
          minutes: 20,
        },
        {
          day: 1,
          hours: 10,
          minutes: 0,
        },
        15
      );

      expect(passed).toBe(false);
    });

    it('Если from не момент времени, выбрасывает RangeError', () => {
      const span = new TimeSpan();

      expect(() =>
        span.hasPassed(
          {
            day: 1,
            hours: 0,
            minutes: 60,
          },
          {
            day: 1,
            hours: 1,
            minutes: 0,
          },
          15
        )
      ).toThrow(RangeError);
    });
  });
});
