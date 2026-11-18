import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { DEFAULT_RECORD, TestAddiction } from '../../dev';
import { NeedCategory, NeedStatus } from '../../src';

/** Зависимость с переданной силой, удовлетворённая полностью в полночь первого дня */
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
  it('Зависимость — потребность категории NeedCategory.Addiction', () => {
    expect(createAddiction(100).category).toBe(NeedCategory.Addiction);
  });

  describe('Тяга', () => {
    // У TestAddiction cravingMinutes — сутки
    it.each<{ strength: number; hours: number; value: number }>([
      {
        strength: 100,
        hours: 24,
        value: 25,
      },
      {
        strength: 100,
        hours: 12,
        value: 62.5,
      },
      {
        strength: 50,
        hours: 24,
        value: 62.5,
      },
      {
        strength: 25,
        hours: 24,
        value: 81.25,
      },
    ])(
      'Значение падает со скоростью, пропорциональной силе: при максимальной силе от MAX_NEED до порога срочности за cravingMinutes. При силе $strength через $hours ч от 100 остаётся $value',
      ({ strength, hours, value }) => {
        expect(createAddiction(strength).get(after(hours))).toBeCloseTo(value);
      }
    );

    it('При силе 0 зависимости нет: значение не падает', () => {
      expect(createAddiction(0).get(after(24 * 30))).toBe(100);
    });

    it('Тянет (статус Urgent), когда значение опустилось ниже порога срочности: при максимальной силе — сразу после cravingMinutes с момента употребления', () => {
      const addiction = createAddiction(100);

      expect(addiction.getStatus(after(24))).not.toBe(NeedStatus.Urgent);
      expect(addiction.getStatus(after(24, 1))).toBe(NeedStatus.Urgent);
    });
  });
});
