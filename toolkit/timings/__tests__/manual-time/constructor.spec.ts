import { describe, expect, it } from 'vitest';

import { ManualTime } from '../../src';

describe('ManualTime', () => {
  describe('#constructor', () => {
    it('Если слепок не передан, время — полночь', () => {
      const time = new ManualTime();

      expect(time.getState()).toStrictEqual({
        hours: 0,
        minutes: 0,
      });
    });

    it('Час равен часу из слепка', () => {
      const time = new ManualTime({
        hours: 20,
        minutes: 15,
      });

      expect(time.hours).toBe(20);
    });

    it('Минуты равны минутам из слепка', () => {
      const time = new ManualTime({
        hours: 20,
        minutes: 15,
      });

      expect(time.minutes).toBe(15);
    });

    it('Воссоздаётся из слепка другого времени', () => {
      const original = new ManualTime({
        hours: 20,
        minutes: 15,
      });

      const time = new ManualTime(original.getState());

      expect(time.getState()).toStrictEqual(original.getState());
    });

    it('Если в слепке час не от 0 до 23, выбрасывает RangeError', () => {
      expect(
        () =>
          new ManualTime({
            hours: 24,
            minutes: 0,
          })
      ).toThrow(RangeError);
    });

    it('Если в слепке минуты не от 0 до 59, выбрасывает RangeError', () => {
      expect(
        () =>
          new ManualTime({
            hours: 0,
            minutes: 60,
          })
      ).toThrow(RangeError);
    });
  });
});
