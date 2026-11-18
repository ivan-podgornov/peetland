import { Item } from '@peetland/inventory';
import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { createMockedAddiction, createMockedAddictionFactory, createAddictionsState } from '../dev';
import { ConsumptionType, Addictions } from '../src';
import type { DrinkDetails } from '../src';

describe('Addictions', () => {
  describe('#consume', () => {
    it('Передаёт каждой зависимости употребление и время', () => {
      const addiction = createMockedAddiction();
      const addictions = new Addictions(createAddictionsState(), {
        addictionFactory: createMockedAddictionFactory(addiction),
      });
      const details: DrinkDetails = { booze: Item.Booze };
      const time = new ManualTime();

      addictions.consume(
        {
          type: ConsumptionType.Drink,
          details,
        },
        time
      );

      expect(addiction.consume).toHaveBeenCalledExactlyOnceWith(
        {
          type: ConsumptionType.Drink,
          details,
        },
        time
      );
    });
  });
});
