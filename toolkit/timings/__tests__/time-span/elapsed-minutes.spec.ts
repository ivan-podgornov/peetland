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

    it('Если моменты в одном часе, возвращает разницу их минут', () => {
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

    it('Если между моментами сменился час, возвращает сумму минут до смены часа и после неё', () => {
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

    it('Если между моментами наступила полночь, возвращает сумму минут до полуночи и после неё', () => {
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

    it('Если моменты в одно время суток разных дней, возвращает 1440 минут за каждый день между ними', () => {
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

    it('Если to раньше from, возвращает минуты от to до from со знаком минус', () => {
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
