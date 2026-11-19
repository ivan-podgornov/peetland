import { createStubTask, planSteps } from '@peetland/htn/dev';
import { Item, ItemClassifier } from '@peetland/inventory';
import type { NpcContext, NpcState } from '@peetland/npc';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { createMockedPlaces, createPlacesWithShopAndSpot } from '@peetland/places/dev';
import { describe, expect, it, vi } from 'vitest';

import { createAddictionsTaskFactoryDeps } from '../../dev';
import { AddictionsTaskFactory } from '../../src';
import { BOOZE_PRICE } from '../../src/constants';

describe('AddictionsTaskFactory', () => {
  describe('Зависимости SatisfyAlcoholismTask', () => {
    it('Задача получает фабрику задач NPC из зависимостей', () => {
      const drink = vi.fn(() => createStubTask<NpcState, NpcContext>('drink'));
      const factory = new AddictionsTaskFactory(
        createAddictionsTaskFactoryDeps({
          places: createPlacesWithShopAndSpot(),
          npcTaskFactory: createNpcTaskFactory({ drink }),
        })
      );
      const state = new NpcStateBuilder().withInventory({ [Item.Booze]: 1 }).build();

      planSteps(factory.satisfyAlcoholism(), state);

      expect(drink).toHaveBeenCalledOnce();
    });

    it('Задача ищет пойло классификатором из зависимостей', () => {
      const itemClassifier = new ItemClassifier();
      vi.spyOn(itemClassifier, 'isBooze');
      const factory = new AddictionsTaskFactory(
        createAddictionsTaskFactoryDeps({ itemClassifier })
      );
      const state = new NpcStateBuilder().withInventory({ [Item.Booze]: 1 }).build();

      planSteps(factory.satisfyAlcoholism(), state);

      expect(itemClassifier.isBooze).toHaveBeenCalledWith(Item.Booze);
    });

    it('Задача получает места из зависимостей', () => {
      const places = createMockedPlaces();
      const factory = new AddictionsTaskFactory(createAddictionsTaskFactoryDeps({ places }));
      const state = new NpcStateBuilder().withInventory({ [Item.Money]: BOOZE_PRICE }).build();

      planSteps(factory.satisfyAlcoholism(), state);

      expect(places.ofType).toHaveBeenCalled();
    });

    it('Задача покупает пойло задачей BuyBoozeTask этой же фабрики', () => {
      const purchase = vi.fn(() => createStubTask<NpcState, NpcContext>('purchase'));
      const factory = new AddictionsTaskFactory(
        createAddictionsTaskFactoryDeps({
          places: createPlacesWithShopAndSpot(),
          npcTaskFactory: createNpcTaskFactory({
            purchase,
            drink: () => createStubTask('drink'),
          }),
        })
      );
      const state = new NpcStateBuilder().withInventory({ [Item.Money]: BOOZE_PRICE }).build();

      planSteps(factory.satisfyAlcoholism(), state);

      expect(purchase).toHaveBeenCalledOnce();
    });
  });
});
