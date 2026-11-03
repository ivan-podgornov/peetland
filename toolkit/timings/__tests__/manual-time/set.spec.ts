import { describe, expect, it } from 'vitest';

import { ManualTime } from '../../src';

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

    it('Если день меньше 1, выбрасывает RangeError', () => {
      const time = new ManualTime();

      expect(() =>
        time.set({
          day: 0,
          hours: 0,
          minutes: 0,
        })
      ).toThrow(RangeError);
    });

    it('Если день не целый, выбрасывает RangeError', () => {
      const time = new ManualTime();

      expect(() =>
        time.set({
          day: 1.5,
          hours: 0,
          minutes: 0,
        })
      ).toThrow(RangeError);
    });

    it('Если час меньше 0, выбрасывает RangeError', () => {
      const time = new ManualTime();

      expect(() =>
        time.set({
          day: 1,
          hours: -1,
          minutes: 0,
        })
      ).toThrow(RangeError);
    });

    it('Если час больше 23, выбрасывает RangeError', () => {
      const time = new ManualTime();

      expect(() =>
        time.set({
          day: 1,
          hours: 24,
          minutes: 0,
        })
      ).toThrow(RangeError);
    });

    it('Если час не целый, выбрасывает RangeError', () => {
      const time = new ManualTime();

      expect(() =>
        time.set({
          day: 1,
          hours: 8.5,
          minutes: 0,
        })
      ).toThrow(RangeError);
    });

    it('Если минуты меньше 0, выбрасывает RangeError', () => {
      const time = new ManualTime();

      expect(() =>
        time.set({
          day: 1,
          hours: 0,
          minutes: -1,
        })
      ).toThrow(RangeError);
    });

    it('Если минуты больше 59, выбрасывает RangeError', () => {
      const time = new ManualTime();

      expect(() =>
        time.set({
          day: 1,
          hours: 0,
          minutes: 60,
        })
      ).toThrow(RangeError);
    });

    it('Если минуты не целые, выбрасывает RangeError', () => {
      const time = new ManualTime();

      expect(() =>
        time.set({
          day: 1,
          hours: 0,
          minutes: 0.5,
        })
      ).toThrow(RangeError);
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
