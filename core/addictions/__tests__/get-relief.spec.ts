import { Item } from '@peetland/inventory';
import { describe, expect, it } from 'vitest';

import { createMockedAddiction, createMockedAddictionFactory, createAddictionsState } from '../dev';
import { ConsumptionType, Addiction, Addictions } from '../src';
import type { DrinkDetails } from '../src';

describe('Addictions', () => {
  describe('#getRelief', () => {
    it('Возвращает, на сколько употребление снимет тягу, по ответу самой зависимости', () => {
      const addiction = createMockedAddiction();
      addiction.getRelief.mockReturnValue(42);
      const addictions = new Addictions(createAddictionsState(), {
        addictionFactory: createMockedAddictionFactory(addiction),
      });
      const details: DrinkDetails = { booze: Item.Booze };

      const gain = addictions.getRelief(Addiction.Alcoholism, {
        type: ConsumptionType.Drink,
        details,
      });

      expect(addiction.getRelief).toHaveBeenCalledExactlyOnceWith({
        type: ConsumptionType.Drink,
        details,
      });
      expect(gain).toBe(42);
    });
  });
});
