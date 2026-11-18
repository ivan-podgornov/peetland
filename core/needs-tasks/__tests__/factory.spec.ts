import { createStubTask, planSteps } from '@peetland/htn/dev';
import { Item, ItemClassifier } from '@peetland/inventory';
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
} from '../dev';
import { NeedsTask, NeedsTaskFactory } from '../src';
import { SatisfyHungerTask } from '../src/satisfy-hunger-task';
import { StockFoodTask } from '../src/stock-food-task';

describe('NeedsTaskFactory', () => {
  describe('#satisfyNeeds', () => {
    it('Возвращает экземпляр NeedsTask', () => {
      const factory = new NeedsTaskFactory(createNeedsTaskFactoryDeps());

      expect(factory.satisfyNeeds()).toBeInstanceOf(NeedsTask);
    });

    it('На каждый вызов возвращает новую задачу', () => {
      const factory = new NeedsTaskFactory(createNeedsTaskFactoryDeps());

      expect(factory.satisfyNeeds()).not.toBe(factory.satisfyNeeds());
    });
  });

  describe('#satisfyHunger', () => {
    it('Возвращает экземпляр SatisfyHungerTask', () => {
      const factory = new NeedsTaskFactory(createNeedsTaskFactoryDeps());

      expect(factory.satisfyHunger()).toBeInstanceOf(SatisfyHungerTask);
    });

    it('На каждый вызов возвращает новую задачу', () => {
      const factory = new NeedsTaskFactory(createNeedsTaskFactoryDeps());

      expect(factory.satisfyHunger()).not.toBe(factory.satisfyHunger());
    });
  });

  describe('#stockFood', () => {
    it('Возвращает экземпляр StockFoodTask', () => {
      const factory = new NeedsTaskFactory(createNeedsTaskFactoryDeps());

      expect(factory.stockFood()).toBeInstanceOf(StockFoodTask);
    });

    it('На каждый вызов возвращает новую задачу', () => {
      const factory = new NeedsTaskFactory(createNeedsTaskFactoryDeps());

      expect(factory.stockFood()).not.toBe(factory.stockFood());
    });
  });

  describe('Зависимости задачи утолить голод', () => {
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

    it('Задача получает классификатор предметов из зависимостей', () => {
      const itemClassifier = new ItemClassifier();
      vi.spyOn(itemClassifier, 'isFood');
      const factory = new NeedsTaskFactory(createNeedsTaskFactoryDeps({ itemClassifier }));
      const state = new NpcStateBuilder()
        .withInventory({ [Item.SmilePizza]: 1 })
        .withNeeds((needs) => needs.withValue(Need.Satiety, 0).build())
        .build();

      planSteps(factory.satisfyHunger(), state);

      expect(itemClassifier.isFood).toHaveBeenCalled();
    });

    it('Задача получает выбор еды из зависимостей', () => {
      const foodChooser = createMockedFoodChooser();
      const factory = new NeedsTaskFactory(createNeedsTaskFactoryDeps({ foodChooser }));
      const state = new NpcStateBuilder()
        .withInventory({ [Item.SmilePizza]: 1 })
        .withNeeds((needs) => needs.withValue(Need.Satiety, 0).build())
        .build();

      planSteps(factory.satisfyHunger(), state);

      expect(foodChooser.choose).toHaveBeenCalledOnce();
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
  });

  describe('Зависимости задачи обзавестись жратвой', () => {
    /** Состояние NPC, у которого есть деньги, а еды нет */
    function createStateWithMoney() {
      return new NpcStateBuilder()
        .withInventory({ [Item.Money]: 1000 })
        .withNeeds((needs) => needs.withValue(Need.Satiety, 40).build())
        .build();
    }

    it('Задача получает фабрику задач NPC из зависимостей', () => {
      const purchase = vi.fn(() => createStubTask<NpcState, NpcContext>('purchase'));
      const factory = new NeedsTaskFactory(
        createNeedsTaskFactoryDeps({
          places: createPlacesWithShopAndCamp(),
          npcTaskFactory: createNpcTaskFactory({ purchase }),
        })
      );

      planSteps(factory.stockFood(), createStateWithMoney());

      expect(purchase).toHaveBeenCalledOnce();
    });

    it('Задача получает классификатор предметов из зависимостей', () => {
      const itemClassifier = new ItemClassifier();
      vi.spyOn(itemClassifier, 'isFood');
      const factory = new NeedsTaskFactory(createNeedsTaskFactoryDeps({ itemClassifier }));

      planSteps(factory.stockFood(), createStateWithMoney());

      expect(itemClassifier.isFood).toHaveBeenCalled();
    });

    it('Задача получает выбор еды из зависимостей', () => {
      const foodChooser = createMockedFoodChooser();
      const factory = new NeedsTaskFactory(
        createNeedsTaskFactoryDeps({
          places: createPlacesWithShopAndCamp(),
          foodChooser,
        })
      );

      planSteps(factory.stockFood(), createStateWithMoney());

      expect(foodChooser.choose).toHaveBeenCalledOnce();
    });

    it('Задача получает места из зависимостей', () => {
      const places = createMockedPlaces();
      const factory = new NeedsTaskFactory(createNeedsTaskFactoryDeps({ places }));

      planSteps(factory.stockFood(), createStateWithMoney());

      expect(places.ofType).toHaveBeenCalled();
    });
  });
});
