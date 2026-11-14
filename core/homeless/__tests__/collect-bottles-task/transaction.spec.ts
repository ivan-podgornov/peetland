import { planSteps, planTransactions } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { createCollectBottlesTask, createPlacesWithTrashBins } from '../../dev';
import { MAX_BOTTLES } from '../../src/constants';

describe('CollectBottlesTask', () => {
  describe('Метод search-random-trash-bin', () => {
    it('Кладёт найденную бутылку в карман, получает её и радуется ей одной транзакцией', () => {
      const task = createCollectBottlesTask(createPlacesWithTrashBins());
      // Осталось место под одну бутылку, поэтому ищется одна
      const state = new NpcStateBuilder()
        .withInventory({ [Item.Bottles]: MAX_BOTTLES - 1 })
        .build();

      const transactions = planTransactions(planSteps(task, state) ?? []);

      expect(transactions).toStrictEqual([['play-animation', 'add-item', 'psyche-react']]);
    });
  });
});
