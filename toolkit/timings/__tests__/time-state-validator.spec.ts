import { describe, expect, it } from 'vitest';

import { TimeStateValidator } from '../src/time-state-validator';

describe('TimeStateValidator', () => {
  describe('#validate', () => {
    it('Если день меньше 1, выбрасывает RangeError', () => {
      const validator = new TimeStateValidator();

      expect(() =>
        validator.validate({
          day: 0,
          hours: 0,
          minutes: 0,
        })
      ).toThrow(RangeError);
    });

    it('Если день не целый, выбрасывает RangeError', () => {
      const validator = new TimeStateValidator();

      expect(() =>
        validator.validate({
          day: 1.5,
          hours: 0,
          minutes: 0,
        })
      ).toThrow(RangeError);
    });

    it('Если час меньше 0, выбрасывает RangeError', () => {
      const validator = new TimeStateValidator();

      expect(() =>
        validator.validate({
          day: 1,
          hours: -1,
          minutes: 0,
        })
      ).toThrow(RangeError);
    });

    it('Если час больше 23, выбрасывает RangeError', () => {
      const validator = new TimeStateValidator();

      expect(() =>
        validator.validate({
          day: 1,
          hours: 24,
          minutes: 0,
        })
      ).toThrow(RangeError);
    });

    it('Если час не целый, выбрасывает RangeError', () => {
      const validator = new TimeStateValidator();

      expect(() =>
        validator.validate({
          day: 1,
          hours: 8.5,
          minutes: 0,
        })
      ).toThrow(RangeError);
    });

    it('Если минуты меньше 0, выбрасывает RangeError', () => {
      const validator = new TimeStateValidator();

      expect(() =>
        validator.validate({
          day: 1,
          hours: 0,
          minutes: -1,
        })
      ).toThrow(RangeError);
    });

    it('Если минуты больше 59, выбрасывает RangeError', () => {
      const validator = new TimeStateValidator();

      expect(() =>
        validator.validate({
          day: 1,
          hours: 0,
          minutes: 60,
        })
      ).toThrow(RangeError);
    });

    it('Если минуты не целые, выбрасывает RangeError', () => {
      const validator = new TimeStateValidator();

      expect(() =>
        validator.validate({
          day: 1,
          hours: 0,
          minutes: 0.5,
        })
      ).toThrow(RangeError);
    });
  });
});
