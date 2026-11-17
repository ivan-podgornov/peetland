import { createStubTask, planSteps } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { createMockedItemClassifier } from '@peetland/inventory/dev';
import { Need } from '@peetland/needs';
import type { NpcContext, NpcState } from '@peetland/npc';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { createMockedPlaces } from '@peetland/places/dev';
import { describe, expect, it, vi } from 'vitest';

import { createNeedsTaskFactoryDeps } from '../dev';
import { NeedsTask, NeedsTaskFactory } from '../src';
import { SatisfyHungerTask } from '../src/satisfy-hunger-task';

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

  describe('Зависимости задачи утолить голод', () => {
    it('Задача получает фабрику задач NPC из зависимостей', () => {
      const eat = vi.fn(() => createStubTask<NpcState, NpcContext>('eat'));
      const factory = new NeedsTaskFactory(
        createNeedsTaskFactoryDeps({ npcTaskFactory: createNpcTaskFactory({ eat }) })
      );
      const state = new NpcStateBuilder()
        .withInventory({ [Item.SmilePizza]: 1 })
        .withNeeds({ [Need.Satiety]: 0 })
        .build();

      planSteps(factory.satisfyHunger(), state);

      expect(eat).toHaveBeenCalledOnce();
    });

    it('Задача получает классификатор предметов из зависимостей', () => {
      const itemClassifier = createMockedItemClassifier();
      const factory = new NeedsTaskFactory(createNeedsTaskFactoryDeps({ itemClassifier }));

      factory.satisfyHunger();

      expect(itemClassifier.isFood).toHaveBeenCalled();
    });

    it('Задача получает места из зависимостей', () => {
      const places = createMockedPlaces();
      const factory = new NeedsTaskFactory(createNeedsTaskFactoryDeps({ places }));
      const state = new NpcStateBuilder()
        .withInventory({ [Item.Money]: 1000 })
        .withNeeds({ [Need.Satiety]: 0 })
        .build();

      planSteps(factory.satisfyHunger(), state);

      expect(places.ofType).toHaveBeenCalled();
    });
  });
});
