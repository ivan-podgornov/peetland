import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { DEFAULT_RECORD, TestAddiction } from '../../dev';
import { AddictionStatus } from '../../src';

/** Зависимость с переданной силой, которую в полночь первого дня совсем не тянет */
function createAddiction(strength: number): TestAddiction {
  return new TestAddiction({
    ...DEFAULT_RECORD,
    satisfaction: 100,
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
    it.each<{ strength: number; hours: number; satisfaction: number }>([
      {
        strength: 100,
        hours: 18,
        satisfaction: 25,
      },
      {
        strength: 100,
        hours: 9,
        satisfaction: 62.5,
      },
      {
        strength: 50,
        hours: 18,
        satisfaction: 62.5,
      },
      {
        strength: 25,
        hours: 18,
        satisfaction: 81.25,
      },
    ])(
      'Удовлетворённость падает со скоростью, пропорциональной силе: при максимальной силе от MAX_SATISFACTION до CRAVING_BELOW за cravingMinutes. При силе $strength через $hours ч от 100 остаётся $satisfaction',
      ({ strength, hours, satisfaction }) => {
        expect(createAddiction(strength).get(after(hours))).toBeCloseTo(satisfaction);
      }
    );

    it('При силе 0 зависимости нет: удовлетворённость не падает', () => {
      expect(createAddiction(0).get(after(24 * 30))).toBe(100);
    });

    it('Тянет (статус Craving), когда удовлетворённость опустилась ниже CRAVING_BELOW: при максимальной силе — сразу после cravingMinutes с момента употребления', () => {
      const addiction = createAddiction(100);

      expect(addiction.getStatus(after(18))).not.toBe(AddictionStatus.Craving);
      expect(addiction.getStatus(after(18, 1))).toBe(AddictionStatus.Craving);
    });
  });
});
