import { describe, expect, it } from 'vitest';

import { ManualTime } from '../../../src';

describe('ManualTime', () => {
  describe('#set', () => {
    it('День равен выставленному', () => {
      const time = new ManualTime();

      time.set({
        day: 3,
        hours: 8,
        minutes: 30,
      });

      expect(time.day).toBe(3);
    });

    it('Час равен выставленному', () => {
      const time = new ManualTime();

      time.set({
        day: 3,
        hours: 8,
        minutes: 30,
      });

      expect(time.hours).toBe(8);
    });

    it('Минуты равны выставленным', () => {
      const time = new ManualTime();

      time.set({
        day: 3,
        hours: 8,
        minutes: 30,
      });

      expect(time.minutes).toBe(30);
    });

    it('Если время не выставлено из-за ошибки, время остаётся прежним', () => {
      const time = new ManualTime({
        day: 3,
        hours: 8,
        minutes: 30,
      });

      expect(() =>
        time.set({
          day: 3,
          hours: 24,
          minutes: 0,
        })
      ).toThrow(RangeError);
      expect(time.getState()).toStrictEqual({
        day: 3,
        hours: 8,
        minutes: 30,
      });
    });
  });
});
