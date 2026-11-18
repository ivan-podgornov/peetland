import { Item } from '@peetland/inventory';
import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { createMockedAddiction, createMockedAddictionFactory, createAddictionsState } from '../dev';
import { ActivityType, Addictions } from '../src';
import type { DrinkDetails } from '../src';

describe('Addictions', () => {
  describe('#perform', () => {
    it('Передаёт зависимости занятие, детали и время', () => {
      const addiction = createMockedAddiction();
      const addictions = new Addictions(createAddictionsState(), {
        addictionFactory: createMockedAddictionFactory(addiction),
      });
      const details: DrinkDetails = { booze: Item.Booze };
      const time = new ManualTime();

      addictions.perform(
        {
          type: ActivityType.Drink,
          details,
        },
        time
      );

      expect(addiction.perform).toHaveBeenCalledExactlyOnceWith(
        {
          type: ActivityType.Drink,
          details,
        },
        time
      );
    });
  });
});
