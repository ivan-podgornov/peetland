import { Item } from '@peetland/inventory';
import { describe, expect, it } from 'vitest';

import { createMockedNeed, createMockedNeedFactory, createNeedsState } from '../dev';
import { Activity, Need, Needs } from '../src';
import type { EatDetails } from '../src';

describe('Needs', () => {
  describe('#getGain', () => {
    it('Возвращает, на сколько занятие изменит потребность, по ответу самой потребности', () => {
      const need = createMockedNeed();
      need.getGain.mockReturnValue(42);
      const needs = new Needs(createNeedsState(), {
        needFactory: createMockedNeedFactory(need),
      });
      const details: EatDetails = { food: Item.SmilePizza };

      const gain = needs.getGain(Need.Satiety, Activity.Eat, details);

      expect(need.getGain).toHaveBeenCalledExactlyOnceWith(Activity.Eat, details);
      expect(gain).toBe(42);
    });
  });
});
