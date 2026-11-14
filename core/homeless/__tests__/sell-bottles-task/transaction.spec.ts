import { planSteps } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { BOTTLES_FOR_BOOZE, createPlacesWithCollection, createSellBottlesTask } from '../../dev';

describe('SellBottlesTask', () => {
  describe('Метод sell-in-nearest-collection', () => {
    it('Отдаёт бутылки и получает деньги одной транзакцией, а дорога до приёмки вне транзакции', () => {
      const task = createSellBottlesTask(createPlacesWithCollection());
      const state = new NpcStateBuilder()
        .withInventory({ [Item.Bottles]: BOTTLES_FOR_BOOZE })
        .build();

      const steps = planSteps(task, state) ?? [];

      expect(steps.map((step) => step.isPartOf?.task.transaction ?? false)).toStrictEqual([
        false,
        false,
        true,
        true,
        true,
      ]);
    });
  });
});
