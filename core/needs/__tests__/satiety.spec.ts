import { Item } from '@peetland/inventory';
import type { Food } from '@peetland/inventory';
import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { createMockedNeedsValidator } from '../dev';
import { Activity, NeedCategory, Satiety } from '../src';

const since = {
  day: 1,
  hours: 10,
  minutes: 0,
};

function createSatiety(value: number) {
  return new Satiety(
    {
      value,
      since,
    },
    { validator: createMockedNeedsValidator() }
  );
}

describe('Satiety', () => {
  it('Сытость — жизненная потребность', () => {
    expect(createSatiety(100).category).toBe(NeedCategory.Vital);
  });

  it('Падает от максимума до нуля за игровые сутки', () => {
    const value = createSatiety(100).get(
      new ManualTime({
        ...since,
        day: 2,
      })
    );

    expect(value).toBe(0);
  });

  it('Если сытость ниже Satiety.URGENT_BELOW, голод срочный', () => {
    const satiety = createSatiety(Satiety.URGENT_BELOW - 1);

    expect(satiety.isUrgent(new ManualTime(since))).toBe(true);
  });

  it('Если сытость выше Satiety.CALM_ABOVE, голод спокойный', () => {
    const satiety = createSatiety(Satiety.CALM_ABOVE + 1);

    expect(satiety.isCalm(new ManualTime(since))).toBe(true);
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
    const need = createSatiety(0);
    const time = new ManualTime(since);

    need.perform(Activity.Eat, { food }, time);

    expect(need.get(time)).toBe(satiety);
  });
});
