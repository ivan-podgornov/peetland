import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { DEFAULT_RECORD, TestAddiction } from '../../dev';
import { AddictionStatus } from '../../src';

/** Зависимость с переданной силой, у которой в полночь первого дня тяги нет */
function createAddiction(strength: number): TestAddiction {
  return new TestAddiction({
    ...DEFAULT_RECORD,
    craving: 0,
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
  describe('Рост тяги', () => {
    // У TestAddiction cravingMinutes — 18 часов
    it.each<{ strength: number; hours: number; craving: number }>([
      {
        strength: 100,
        hours: 18,
        craving: 75,
      },
      {
        strength: 100,
        hours: 9,
        craving: 37.5,
      },
      {
        strength: 50,
        hours: 18,
        craving: 37.5,
      },
      {
        strength: 25,
        hours: 18,
        craving: 18.75,
      },
    ])(
      'Тяга растёт со скоростью, пропорциональной силе: при максимальной силе от MIN_CRAVING до CRAVING_ABOVE за cravingMinutes. При силе $strength через $hours ч тяга $craving',
      ({ strength, hours, craving }) => {
        expect(createAddiction(strength).get(after(hours))).toBeCloseTo(craving);
      }
    );

    it('При силе 0 зависимости нет: тяга не растёт', () => {
      expect(createAddiction(0).get(after(24 * 30))).toBe(0);
    });

    it('Тянет (статус Craving), когда тяга поднялась выше CRAVING_ABOVE: при максимальной силе — сразу после cravingMinutes с момента, как тягу сняли', () => {
      const addiction = createAddiction(100);

      expect(addiction.getStatus(after(18))).not.toBe(AddictionStatus.Craving);
      expect(addiction.getStatus(after(18, 1))).toBe(AddictionStatus.Craving);
    });
  });
});
