import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { DEFAULT_RECORD, TestAddiction } from '../../dev';
import { AddictionStatus } from '../../src';

/** Зависимость с переданной силой, которую в полночь первого дня совсем не тянет */
function createAddiction(strength: number): TestAddiction {
  return new TestAddiction({
    ...DEFAULT_RECORD,
    value: 100,
    strength,
  });
}

/** Время через hours часов и minutes минут после полуночи первого дня */
function after(hours: number, minutes = 0): ManualTime {
  return new ManualTime({
    day: 1 + Math.floor(hours / 24),
    hours: hours % 24,
    minutes,
  });
}

describe('BaseAddiction', () => {
  describe('Тяга', () => {
    // У TestAddiction cravingMinutes — 18 часов
    it.each<{ strength: number; hours: number; value: number }>([
      {
        strength: 100,
        hours: 18,
        value: 25,
      },
      {
        strength: 100,
        hours: 9,
        value: 62.5,
      },
      {
        strength: 50,
        hours: 18,
        value: 62.5,
      },
      {
        strength: 25,
        hours: 18,
        value: 81.25,
      },
    ])(
      'Значение падает со скоростью, пропорциональной силе: при максимальной силе от MAX_VALUE до порога срочности за cravingMinutes. При силе $strength через $hours ч от 100 остаётся $value',
      ({ strength, hours, value }) => {
        expect(createAddiction(strength).get(after(hours))).toBeCloseTo(value);
      }
    );

    it('При силе 0 зависимости нет: значение не падает', () => {
      expect(createAddiction(0).get(after(24 * 30))).toBe(100);
    });

    it('Тянет (статус Urgent), когда значение опустилось ниже порога срочности: при максимальной силе — сразу после cravingMinutes с момента употребления', () => {
      const addiction = createAddiction(100);

      expect(addiction.getStatus(after(18))).not.toBe(AddictionStatus.Urgent);
      expect(addiction.getStatus(after(18, 1))).toBe(AddictionStatus.Urgent);
    });
  });
});
