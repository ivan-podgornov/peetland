import { Item } from '@peetland/inventory';
import type { Food } from '@peetland/inventory';
import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { Activity, NeedCategory, SatietyModel } from '../src';

const since = {
  day: 1,
  hours: 10,
  minutes: 0,
};

describe('SatietyModel', () => {
  it('Сытость — жизненная потребность', () => {
    expect(new SatietyModel().category).toBe(NeedCategory.Vital);
  });

  it('Падает от максимума до нуля за игровые сутки', () => {
    const value = new SatietyModel().get(
      {
        value: 100,
        since,
      },
      new ManualTime({
        ...since,
        day: 2,
      })
    );

    expect(value).toBe(0);
  });

  it.each<{ food: Food; satiety: number }>([
    {
      food: Item.RomashkaLoaf,
      satiety: 60,
    },
    {
      food: Item.SmilePizza,
      satiety: 100,
    },
  ])('Если съели $food, восполняет $satiety сытости', ({ food, satiety }) => {
    const record = new SatietyModel().perform(
      {
        value: 0,
        since,
      },
      Activity.Eat,
      { food },
      new ManualTime(since)
    );

    expect(record.value).toBe(satiety);
  });
});
