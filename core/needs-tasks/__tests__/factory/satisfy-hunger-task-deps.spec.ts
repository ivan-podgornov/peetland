import { createStubTask, planSteps } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { Need } from '@peetland/needs';
import type { NpcContext, NpcState } from '@peetland/npc';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { createMockedPlaces } from '@peetland/places/dev';
import { describe, expect, it, vi } from 'vitest';

import {
  createMockedFoodChooser,
  createNeedsTaskFactoryDeps,
  createPlacesWithShopAndCamp,
} from '../../dev';
import { NeedsTaskFactory } from '../../src';

describe('NeedsTaskFactory', () => {
  describe('Зависимости SatisfyHungerTask', () => {
    it('Задача получает фабрику задач NPC из зависимостей', () => {
      const eat = vi.fn(() => createStubTask<NpcState, NpcContext>('eat'));
      const factory = new NeedsTaskFactory(
        createNeedsTaskFactoryDeps({ npcTaskFactory: createNpcTaskFactory({ eat }) })
      );
      const state = new NpcStateBuilder()
        .withInventory({ [Item.SmilePizza]: 1 })
        .withNeeds((needs) => needs.withValue(Need.Satiety, 0).build())
        .build();

      planSteps(factory.satisfyHunger(), state);

      expect(eat).toHaveBeenCalledOnce();
    });

    it('Задача получает выбор еды из зависимостей', () => {
      const foodChooser = createMockedFoodChooser({ fromInventory: Item.SmilePizza });
      const factory = new NeedsTaskFactory(createNeedsTaskFactoryDeps({ foodChooser }));
      const state = new NpcStateBuilder()
        .withNeeds((needs) => needs.withValue(Need.Satiety, 0).build())
        .build();

      planSteps(factory.satisfyHunger(), state);

      expect(foodChooser.chooseFromInventory).toHaveBeenCalled();
    });

    it('Задача получает места из зависимостей', () => {
      const places = createMockedPlaces();
      const factory = new NeedsTaskFactory(createNeedsTaskFactoryDeps({ places }));
      const state = new NpcStateBuilder()
        .withInventory({ [Item.Money]: 1000 })
        .withNeeds((needs) => needs.withValue(Need.Satiety, 0).build())
        .build();

      planSteps(factory.satisfyHunger(), state);

      expect(places.ofType).toHaveBeenCalled();
    });

    it('Задача покупает еду задачей BuyFoodTask этой же фабрики', () => {
      const purchase = vi.fn(() => createStubTask<NpcState, NpcContext>('purchase'));
      const factory = new NeedsTaskFactory(
        createNeedsTaskFactoryDeps({
          places: createPlacesWithShopAndCamp(),
          npcTaskFactory: createNpcTaskFactory({
            purchase,
            eat: () => createStubTask('eat'),
          }),
        })
      );
      const state = new NpcStateBuilder()
        .withInventory({ [Item.Money]: 1000 })
        .withNeeds((needs) => needs.withValue(Need.Satiety, 0).build())
        .build();

      planSteps(factory.satisfyHunger(), state);

      expect(purchase).toHaveBeenCalledOnce();
    });
  });
});
