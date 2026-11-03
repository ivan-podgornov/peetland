import { describe, expect, it } from 'vitest';

import { ManualTime } from '../../../src';

describe('ManualTime', () => {
  describe('#set', () => {
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
  });
});
