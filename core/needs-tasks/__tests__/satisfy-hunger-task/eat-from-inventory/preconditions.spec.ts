import { planSteps } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { createSpiedItemClassifier } from '@peetland/inventory/dev';
import { Need } from '@peetland/needs';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createMockedPlaces } from '@peetland/places/dev';
import { describe, expect, it } from 'vitest';

import { createSatisfyHungerTask } from '../../../dev';

describe('SatisfyHungerTask', () => {
  describe('Метод eat-from-inventory', () => {
    describe('Предусловия', () => {
      it('Если в инвентаре есть еда, план составляется', () => {
        // Магазинов нет: план составляется только из того, что есть
        const task = createSatisfyHungerTask({ places: createMockedPlaces() });
        const state = new NpcStateBuilder()
          .withInventory({ [Item.RomashkaLoaf]: 1 })
          .withNeeds({ [Need.Satiety]: 10 })
          .build();

        expect(planSteps(task, state)).not.toBeNull();
      });

      it('Если еды в инвентаре нет, план не составляется', () => {
        const task = createSatisfyHungerTask({ places: createMockedPlaces() });
        const state = new NpcStateBuilder()
          .withInventory({ [Item.Booze]: 1 })
          .withNeeds({ [Need.Satiety]: 10 })
          .build();

        expect(planSteps(task, state)).toBeNull();
      });

      it('Что из инвентаря еда, решает классификатор предметов', () => {
        const itemClassifier = createSpiedItemClassifier();
        const task = createSatisfyHungerTask({
          itemClassifier,
          places: createMockedPlaces(),
        });
        const state = new NpcStateBuilder()
          .withInventory({ [Item.Booze]: 1 })
          .withNeeds({ [Need.Satiety]: 10 })
          .build();

        planSteps(task, state);

        expect(itemClassifier.isFood).toHaveBeenCalledWith(Item.Booze);
      });
    });
  });
});
