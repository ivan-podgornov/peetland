import { PlanStructureBuilder, planSteps, planTree } from '@peetland/htn/dev';
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

      const tree = planTree(planSteps(task, state) ?? []);

      expect(tree).toStrictEqual(
        new PlanStructureBuilder()
          .compound('sell-bottles', 'sell-in-nearest-collection', (sell) =>
            sell
              .primitive('go-to-coords')
              .primitive('achieve-angle')
              .transaction('hand-over-bottles', 'hand-over-bottles', (handOver) =>
                handOver.primitive('play-animation').primitive('remove-item').primitive('add-item')
              )
          )
          .build()
      );
    });
  });
});
