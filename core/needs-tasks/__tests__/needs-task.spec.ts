import { createStubTask, planSteps, PlanStructureBuilder, planTree } from '@peetland/htn/dev';
import { Need } from '@peetland/needs';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { createMockedNeedsTaskFactory } from '../dev';
import { NeedsTask } from '../src';

/** Создаёт состояние NPC с переданной сытостью */
function createStateWithSatiety(satiety: number) {
  return new NpcStateBuilder().withNeeds({ [Need.Satiety]: satiety }).build();
}

describe('NeedsTask', () => {
  it('Создаёт задачу утолить голод фабрикой needsTaskFactory', () => {
    const needsTaskFactory = createMockedNeedsTaskFactory();

    new NeedsTask({ needsTaskFactory });

    expect(needsTaskFactory.satisfyHunger).toHaveBeenCalledOnce();
  });

  describe('Метод satisfy-hunger', () => {
    it('Если голод срочный, планирует утолить голод', () => {
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

    it('Если голод не срочный, план не составляется', () => {
      const task = new NeedsTask({
        needsTaskFactory: createMockedNeedsTaskFactory(),
      });
      const state = createStateWithSatiety(100);

      expect(planSteps(task, state)).toBeNull();
    });

    it('Если утолить голод нечем, план не составляется', () => {
      const task = new NeedsTask({
        needsTaskFactory: createMockedNeedsTaskFactory({
          satisfyHunger: () => createStubTask('satisfy-hunger', false),
        }),
      });
      const state = createStateWithSatiety(0);

      expect(planSteps(task, state)).toBeNull();
    });
  });
});
