import { Item } from '@peetland/inventory';
import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { DEFAULT_ADDICTION_DEPS, DEFAULT_RECORD } from '../dev';
import { ActivityType, AddictionStatus } from '../src';
import { Alcoholism } from '../src/alcoholism';

const DRINK = {
  type: ActivityType.Drink,
  details: { booze: Item.Booze },
} as const;

describe('Alcoholism', () => {
  it('При максимальной силе выпившего NPC снова тянет выпить через сутки', () => {
    const alcoholism = new Alcoholism(DEFAULT_RECORD, DEFAULT_ADDICTION_DEPS);
    const day = {
      day: 2,
      hours: 0,
    };

    expect(
      alcoholism.getStatus(
        new ManualTime({
          ...day,
          minutes: 0,
        })
      )
    ).not.toBe(AddictionStatus.Urgent);
    expect(
      alcoholism.getStatus(
        new ManualTime({
          ...day,
          minutes: 1,
        })
      )
    ).toBe(AddictionStatus.Urgent);
  });

  it('Выпивка снимает тягу полностью: getGain возвращает MAX_VALUE', () => {
    const alcoholism = new Alcoholism(DEFAULT_RECORD, DEFAULT_ADDICTION_DEPS);

    expect(alcoholism.getGain(DRINK)).toBe(Alcoholism.MAX_VALUE);
  });
});
