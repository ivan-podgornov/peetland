import { Item } from '@peetland/inventory';
import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { createMockedNeed, createMockedNeedFactory, createNeedsState } from '../dev';
import { ActivityType, Needs } from '../src';
import type { EatDetails } from '../src';

describe('Needs', () => {
  describe('#perform', () => {
    it('Передаёт каждой потребности занятие и время', () => {
      const need = createMockedNeed();
      const needs = new Needs(createNeedsState(), {
        needFactory: createMockedNeedFactory(need),
      });
      const details: EatDetails = { food: Item.SmilePizza };
      const time = new ManualTime();

      needs.perform(
        {
          type: ActivityType.Eat,
          details,
        },
        time
      );

      expect(need.perform).toHaveBeenCalledWith(
        {
          type: ActivityType.Eat,
          details,
        },
        time
      );
    });
  });
});
