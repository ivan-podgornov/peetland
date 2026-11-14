import { planSteps } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { createCollectBottlesTask, createPlacesWithTrashBins } from '../../dev';
import { MAX_BOTTLES } from '../../src/constants';

describe('CollectBottlesTask', () => {
  describe('Метод search-random-trash-bin', () => {
    it('Кладёт найденную бутылку в карман, получает её и радуется ей одной транзакцией, а ищет вне транзакции', () => {
      const task = createCollectBottlesTask(createPlacesWithTrashBins());
      // Осталось место под одну бутылку, поэтому ищется одна
      const state = new NpcStateBuilder()
        .withInventory({ [Item.Bottles]: MAX_BOTTLES - 1 })
        .build();

      const steps = planSteps(task, state) ?? [];

      expect(
        steps.map((step) => [step.task.name, step.isPartOf?.task.transaction ?? false])
      ).toStrictEqual([
        ['go-to-coords', false],
        ['achieve-angle', false],
        ['play-animation', false],
        ['parallel', false],
        ['play-animation', true],
        ['add-item', true],
        ['psyche-react', true],
        ['play-animation', false],
      ]);
    });
  });
});
