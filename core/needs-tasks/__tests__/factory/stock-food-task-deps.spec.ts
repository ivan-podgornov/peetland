import { createStubTask, planSteps } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import type { NpcContext, NpcState } from '@peetland/npc';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { createMockedPlaces, createPlacesWithShopAndMealSpot } from '@peetland/places/dev';
import { describe, expect, it, vi } from 'vitest';

import { createMockedFoodChooser, createNeedsTaskFactoryDeps } from '../../dev';
import { NeedsTaskFactory } from '../../src';

describe('NeedsTaskFactory', () => {
  describe('Зависимости StockFoodTask', () => {
    it('Задача получает выбор еды из зависимостей', () => {
      const foodChooser = createMockedFoodChooser();
      const factory = new NeedsTaskFactory(createNeedsTaskFactoryDeps({ foodChooser }));

      planSteps(factory.stockFood(), NpcStateBuilder.default());

      expect(foodChooser.chooseFromInventory).toHaveBeenCalled();
    });

    it('Задача получает места из зависимостей', () => {
      const places = createMockedPlaces();
      const factory = new NeedsTaskFactory(
        createNeedsTaskFactoryDeps({
          places,
          foodChooser: createMockedFoodChooser({ toBuy: Item.SmilePizza }),
        })
      );

      planSteps(factory.stockFood(), NpcStateBuilder.default());

      expect(places.ofType).toHaveBeenCalled();
    });

    it('Задача покупает еду задачей BuyFoodTask этой же фабрики', () => {
      const purchase = vi.fn(() => createStubTask<NpcState, NpcContext>('purchase'));
      const factory = new NeedsTaskFactory(
        createNeedsTaskFactoryDeps({
          places: createPlacesWithShopAndMealSpot(),
          npcTaskFactory: createNpcTaskFactory({ purchase }),
          foodChooser: createMockedFoodChooser({ toBuy: Item.SmilePizza }),
        })
      );

      planSteps(factory.stockFood(), NpcStateBuilder.default());

      expect(purchase).toHaveBeenCalledOnce();
    });
  });
});
