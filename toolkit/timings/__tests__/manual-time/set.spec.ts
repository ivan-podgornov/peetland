import { describe, expect, it } from 'vitest';

import { ManualTime } from '../../src';

describe('ManualTime', () => {
  describe('#set', () => {
    it('Час равен выставленному', () => {
      const time = new ManualTime();

      time.set(8, 30);

      expect(time.hours).toBe(8);
    });

    it('Минуты равны выставленным', () => {
      const time = new ManualTime();

      time.set(8, 30);

      expect(time.minutes).toBe(30);
    });

    it('Если час меньше 0, выбрасывает RangeError', () => {
      const time = new ManualTime();

      expect(() => time.set(-1, 0)).toThrow(RangeError);
    });

    it('Если час больше 23, выбрасывает RangeError', () => {
      const time = new ManualTime();

      expect(() => time.set(24, 0)).toThrow(RangeError);
    });

    it('Если час не целый, выбрасывает RangeError', () => {
      const time = new ManualTime();

      expect(() => time.set(8.5, 0)).toThrow(RangeError);
    });

    it('Если минуты меньше 0, выбрасывает RangeError', () => {
      const time = new ManualTime();

      expect(() => time.set(0, -1)).toThrow(RangeError);
    });

    it('Если минуты больше 59, выбрасывает RangeError', () => {
      const time = new ManualTime();

      expect(() => time.set(0, 60)).toThrow(RangeError);
    });

    it('Если минуты не целые, выбрасывает RangeError', () => {
      const time = new ManualTime();

      expect(() => time.set(0, 0.5)).toThrow(RangeError);
    });

    it('Если время не выставлено из-за ошибки, время остаётся прежним', () => {
      const time = new ManualTime({
        hours: 8,
        minutes: 30,
      });

      expect(() => time.set(24, 0)).toThrow(RangeError);
      expect(time.minutesSinceMidnight).toBe(8 * 60 + 30);
    });
  });
});
