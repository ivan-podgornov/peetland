import { Item } from '@peetland/inventory';
import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { createMockedNeedModel, createNeedsDeps, createNeedsState } from '../dev';
import { Activity, Need, Needs } from '../src';
import type { EatDetails } from '../src';

const record = {
  value: 80,
  since: {
    day: 1,
    hours: 10,
    minutes: 0,
  },
};

describe('Needs', () => {
  describe('#perform', () => {
    it('Передаёт модели потребности её запись, занятие, детали и время', () => {
      const model = createMockedNeedModel();
      const needs = new Needs(
        createNeedsState({ [Need.Satiety]: record }),
        createNeedsDeps({ models: { [Need.Satiety]: model } })
      );
      const details: EatDetails = { food: Item.SmilePizza };
      const time = new ManualTime();

      needs.perform(Activity.Eat, details, time);

      expect(model.perform).toHaveBeenCalledExactlyOnceWith(record, Activity.Eat, details, time);
    });

    it('Сохраняет запись, которую вернула модель потребности', () => {
      const model = createMockedNeedModel();
      const changed = {
        value: 100,
        since: {
          day: 1,
          hours: 16,
          minutes: 0,
        },
      };
      model.perform.mockReturnValue(changed);
      const needs = new Needs(
        createNeedsState({ [Need.Satiety]: record }),
        createNeedsDeps({ models: { [Need.Satiety]: model } })
      );

      needs.perform(Activity.Eat, { food: Item.SmilePizza }, new ManualTime());

      expect(needs.getState()[Need.Satiety]).toBe(changed);
    });
  });
});
