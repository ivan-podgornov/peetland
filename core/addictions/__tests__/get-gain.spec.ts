import { Item } from '@peetland/inventory';
import { describe, expect, it } from 'vitest';

import { createMockedAddiction, createMockedAddictionFactory, createAddictionsState } from '../dev';
import { ConsumptionType, Addiction, Addictions } from '../src';
import type { DrinkDetails } from '../src';

describe('Addictions', () => {
  describe('#getGain', () => {
    it('Возвращает, на сколько употребление поднимет удовлетворённость, по ответу самой зависимости', () => {
      const addiction = createMockedAddiction();
      addiction.getGain.mockReturnValue(42);
      const addictions = new Addictions(createAddictionsState(), {
        addictionFactory: createMockedAddictionFactory(addiction),
      });
      const details: DrinkDetails = { booze: Item.Booze };

      const gain = addictions.getGain(Addiction.Alcoholism, {
        type: ConsumptionType.Drink,
        details,
      });

      expect(addiction.getGain).toHaveBeenCalledExactlyOnceWith({
        type: ConsumptionType.Drink,
        details,
      });
      expect(gain).toBe(42);
    });
  });
});
