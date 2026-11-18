import { Item } from '@peetland/inventory';
import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { DEFAULT_NEED_DEPS, DEFAULT_RECORD } from '../dev';
import { ActivityType, NeedStatus } from '../src';
import { Alcoholism } from '../src/alcoholism';

/** Алкоголизм с переданной силой и значением, выставленным в полночь первого дня */
function createAlcoholism(strength: number, value = 100): Alcoholism {
  return new Alcoholism(
    {
      ...DEFAULT_RECORD,
      value,
      strength,
    },
    DEFAULT_NEED_DEPS
  );
}

const DRINK = {
  type: ActivityType.Drink,
  details: { booze: Item.Booze },
} as const;

const EAT = {
  type: ActivityType.Eat,
  details: { food: Item.SmilePizza },
} as const;

describe('Alcoholism', () => {
  it('При максимальной силе выпившего NPC снова тянет выпить через сутки', () => {
    const alcoholism = createAlcoholism(100);

    expect(
      alcoholism.getStatus(
        new ManualTime({
          day: 2,
          hours: 0,
          minutes: 0,
        })
      )
    ).not.toBe(NeedStatus.Urgent);
    expect(
      alcoholism.getStatus(
        new ManualTime({
          day: 2,
          hours: 0,
          minutes: 1,
        })
      )
    ).toBe(NeedStatus.Urgent);
  });

  describe('#getGain', () => {
    it('Выпивка снимает тягу полностью: возвращает MAX_NEED', () => {
      expect(createAlcoholism(100).getGain(DRINK)).toBe(100);
    });

    it('Еда не влияет на тягу к алкоголю: возвращает 0', () => {
      expect(createAlcoholism(100).getGain(EAT)).toBe(0);
    });
  });

  describe('#perform', () => {
    it('Если выпил, тяга снята полностью', () => {
      const alcoholism = createAlcoholism(100, 10);
      const time = new ManualTime({
        day: 1,
        hours: 6,
        minutes: 0,
      });

      alcoholism.perform(DRINK, time);

      expect(alcoholism.get(time)).toBe(100);
    });

    it('Еда не влияет на тягу к алкоголю', () => {
      const alcoholism = createAlcoholism(100, 50);
      const time = new ManualTime({
        day: 1,
        hours: 6,
        minutes: 0,
      });
      const before = alcoholism.get(time);

      alcoholism.perform(EAT, time);

      expect(alcoholism.get(time)).toBe(before);
    });
  });
});
