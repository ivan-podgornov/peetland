import { describe, expect, it } from 'vitest';

import { ManualTime } from '../../src';

describe('ManualTime', () => {
  describe('#constructor', () => {
    it('Если слепок не передан, время — полночь первого дня', () => {
      const time = new ManualTime();

      expect(time.getState()).toStrictEqual({
        day: 1,
        hours: 0,
        minutes: 0,
      });
    });

    it('День равен дню из слепка', () => {
      const time = new ManualTime({
        day: 3,
        hours: 20,
        minutes: 15,
      });

      expect(time.day).toBe(3);
    });

    it('Час равен часу из слепка', () => {
      const time = new ManualTime({
        day: 3,
        hours: 20,
        minutes: 15,
      });

      expect(time.hours).toBe(20);
    });

    it('Минуты равны минутам из слепка', () => {
      const time = new ManualTime({
        day: 3,
        hours: 20,
        minutes: 15,
      });

      expect(time.minutes).toBe(15);
    });

    it('Воссоздаётся из слепка другого времени', () => {
      const original = new ManualTime({
        day: 3,
        hours: 20,
        minutes: 15,
      });

      const time = new ManualTime(original.getState());

      expect(time.getState()).toStrictEqual(original.getState());
    });

    it('Если слепок не момент времени, выбрасывает RangeError', () => {
      expect(
        () =>
          new ManualTime({
            day: 0,
            hours: 0,
            minutes: 0,
          })
      ).toThrow(RangeError);
    });
  });
});
