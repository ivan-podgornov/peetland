import { createStubTask, planSteps, PlanStructureBuilder, planTree } from '@peetland/htn/dev';
import { Need } from '@peetland/needs';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { createMockedNeedsTaskFactory } from '../dev';
import { NeedsTask } from '../src';

/** Создаёт состояние NPC с переданной сытостью */
function createStateWithSatiety(satiety: number) {
  return new NpcStateBuilder()
    .withNeeds((needs) => needs.withValue(Need.Satiety, satiety).build())
    .build();
}

describe('NeedsTask', () => {
  it('Создаёт SatisfyHungerTask фабрикой needsTaskFactory', () => {
    const needsTaskFactory = createMockedNeedsTaskFactory();

    new NeedsTask({ needsTaskFactory });

    expect(needsTaskFactory.satisfyHunger).toHaveBeenCalledOnce();
  });

  it('Создаёт StockFoodTask фабрикой needsTaskFactory', () => {
    const needsTaskFactory = createMockedNeedsTaskFactory();

    new NeedsTask({ needsTaskFactory });

    expect(needsTaskFactory.stockFood).toHaveBeenCalledOnce();
  });

  describe('Метод satisfy-hunger', () => {
    it('Если голод срочный, планирует SatisfyHungerTask', () => {
      const task = new NeedsTask({
        needsTaskFactory: createMockedNeedsTaskFactory(),
      });
      const state = createStateWithSatiety(0);

      expect(planTree(planSteps(task, state) ?? [])).toStrictEqual(
        new PlanStructureBuilder()
          .compound('needs', 'satisfy-hunger', (needs) => needs.primitive('satisfy-hunger'))
          .build()
      );
    });

    it('Если голод срочный, а SatisfyHungerTask не спланировать, планирует StockFoodTask', () => {
      const task = new NeedsTask({
        needsTaskFactory: createMockedNeedsTaskFactory({
          satisfyHunger: () => createStubTask('satisfy-hunger', false),
        }),
      });
      const state = createStateWithSatiety(0);

      expect(planTree(planSteps(task, state) ?? [])).toStrictEqual(
        new PlanStructureBuilder()
          .compound('needs', 'stock-food', (needs) => needs.primitive('stock-food'))
          .build()
      );
    });
  });

  describe('Метод stock-food', () => {
    it('Если сытость умеренная, планирует StockFoodTask', () => {
      const task = new NeedsTask({
        needsTaskFactory: createMockedNeedsTaskFactory(),
      });
      const state = createStateWithSatiety(40);

      expect(planTree(planSteps(task, state) ?? [])).toStrictEqual(
        new PlanStructureBuilder()
          .compound('needs', 'stock-food', (needs) => needs.primitive('stock-food'))
          .build()
      );
    });

    it('Если сытость спокойная, план не составляется', () => {
      const task = new NeedsTask({
        needsTaskFactory: createMockedNeedsTaskFactory(),
      });
      const state = createStateWithSatiety(70);

      expect(planSteps(task, state)).toBeNull();
    });

    it('Если ни SatisfyHungerTask, ни StockFoodTask не спланировать, план не составляется', () => {
      const task = new NeedsTask({
        needsTaskFactory: createMockedNeedsTaskFactory({
          satisfyHunger: () => createStubTask('satisfy-hunger', false),
          stockFood: () => createStubTask('stock-food', false),
        }),
      });
      const state = createStateWithSatiety(0);

      expect(planSteps(task, state)).toBeNull();
    });
  });
});
