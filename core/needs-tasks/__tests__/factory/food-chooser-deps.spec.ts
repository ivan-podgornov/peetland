import { planSteps } from '@peetland/htn/dev';
import { Item, ItemClassifier } from '@peetland/inventory';
import { Need } from '@peetland/needs';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it, vi } from 'vitest';

import { createNeedsTaskFactoryDeps } from '../../dev';
import { NeedsTaskFactory } from '../../src';

describe('NeedsTaskFactory', () => {
  describe('Зависимости FoodChooser', () => {
    it('FoodChooser по умолчанию получает классификатор предметов из зависимостей', () => {
      const itemClassifier = new ItemClassifier();
      vi.spyOn(itemClassifier, 'isFood');
      const factory = new NeedsTaskFactory(createNeedsTaskFactoryDeps({ itemClassifier }));
      const state = new NpcStateBuilder()
        .withInventory({ [Item.SmilePizza]: 1 })
        .withNeeds((needs) => needs.withValue(Need.Satiety, 0).build())
        .build();

      planSteps(factory.satisfyHunger(), state);

      expect(itemClassifier.isFood).toHaveBeenCalledWith(Item.SmilePizza);
    });
  });
});
