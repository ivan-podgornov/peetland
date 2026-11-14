import { createStubTask, planNames } from '@peetland/htn/dev';
import { NEED_DEFINITIONS, Need } from '@peetland/needs';
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
    it('Если сытость ниже порога срочности, планирует утолить голод', () => {
      const task = new NeedsTask({
        needsTaskFactory: createMockedNeedsTaskFactory(),
      });
      const state = createStateWithSatiety(NEED_DEFINITIONS[Need.Satiety].urgentBelow - 1);

      expect(planNames(task, state)).toStrictEqual(['satisfy-hunger']);
    });

    it('Если сытость на пороге срочности, план не составляется', () => {
      const task = new NeedsTask({
        needsTaskFactory: createMockedNeedsTaskFactory(),
      });
      const state = createStateWithSatiety(NEED_DEFINITIONS[Need.Satiety].urgentBelow);

      expect(planNames(task, state)).toBeNull();
    });

    it('Если утолить голод нечем, план не составляется', () => {
      const task = new NeedsTask({
        needsTaskFactory: createMockedNeedsTaskFactory({
          satisfyHunger: () => createStubTask('satisfy-hunger', false),
        }),
      });
      const state = createStateWithSatiety(NEED_DEFINITIONS[Need.Satiety].urgentBelow - 1);

      expect(planNames(task, state)).toBeNull();
    });
  });
});
