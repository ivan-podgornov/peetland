import { describe, expect, it } from 'vitest';

import { TimeSpan } from '../../src';

describe('TimeSpan', () => {
  describe('#elapsedMinutes', () => {
    it('Если моменты совпадают, возвращает 0', () => {
      const span = new TimeSpan();
      const moment = {
        day: 2,
        hours: 10,
        minutes: 30,
      };

      expect(span.elapsedMinutes(moment, moment)).toBe(0);
    });

    it('Возвращает разницу в минутах внутри одного часа', () => {
      const span = new TimeSpan();

      const elapsed = span.elapsedMinutes(
        {
          day: 1,
          hours: 10,
          minutes: 5,
        },
        {
          day: 1,
          hours: 10,
          minutes: 20,
        }
      );

      expect(elapsed).toBe(15);
    });

    it('Учитывает смену часа', () => {
      const span = new TimeSpan();

      const elapsed = span.elapsedMinutes(
        {
          day: 1,
          hours: 10,
          minutes: 50,
        },
        {
          day: 1,
          hours: 11,
          minutes: 5,
        }
      );

      expect(elapsed).toBe(15);
    });

    it('Учитывает переход через полночь', () => {
      const span = new TimeSpan();

      const elapsed = span.elapsedMinutes(
        {
          day: 1,
          hours: 23,
          minutes: 50,
        },
        {
          day: 2,
          hours: 0,
          minutes: 5,
        }
      );

      expect(elapsed).toBe(15);
    });

    it('Учитывает несколько дней', () => {
      const span = new TimeSpan();

      const elapsed = span.elapsedMinutes(
        {
          day: 1,
          hours: 10,
          minutes: 0,
        },
        {
          day: 3,
          hours: 10,
          minutes: 0,
        }
      );

      expect(elapsed).toBe(2 * 24 * 60);
    });

    it('Если to раньше from, возвращает отрицательное число', () => {
      const span = new TimeSpan();

      const elapsed = span.elapsedMinutes(
        {
          day: 2,
          hours: 0,
          minutes: 5,
        },
        {
          day: 1,
          hours: 23,
          minutes: 50,
        }
      );

      expect(elapsed).toBe(-15);
    });

    it('Если from не момент времени, выбрасывает RangeError', () => {
      const span = new TimeSpan();

      expect(() =>
        span.elapsedMinutes(
          {
            day: 0,
            hours: 0,
            minutes: 0,
          },
          {
            day: 1,
            hours: 0,
            minutes: 0,
          }
        )
      ).toThrow(RangeError);
    });

    it('Если to не момент времени, выбрасывает RangeError', () => {
      const span = new TimeSpan();

      expect(() =>
        span.elapsedMinutes(
          {
            day: 1,
            hours: 0,
            minutes: 0,
          },
          {
            day: 1,
            hours: 24,
            minutes: 0,
          }
        )
      ).toThrow(RangeError);
    });
  });
});
