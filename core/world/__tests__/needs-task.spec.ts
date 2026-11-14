import { createStubTask, planNames } from '@peetland/htn/dev';
import { NEED_DEFINITIONS, NEED_PRIORITY, Need, NeedCategory } from '@peetland/needs';
import { createMockedSatisfyNeedTaskFactory } from '@peetland/needs-tasks/dev';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { NeedsTask } from '../src/needs-task';

/** Состояние NPC, у которого сытость ниже порога срочности */
function createHungryState() {
  return new NpcStateBuilder()
    .withNeeds({ [Need.Satiety]: NEED_DEFINITIONS[Need.Satiety].urgentBelow - 1 })
    .build();
}

describe('NeedsTask', () => {
  it('Создаёт задачу удовлетворения фабрикой satisfyNeedTaskFactory для каждой жизненной потребности', () => {
    const satisfyNeedTaskFactory = createMockedSatisfyNeedTaskFactory(createStubTask('eat'));

    new NeedsTask({ satisfyNeedTaskFactory });

    expect(satisfyNeedTaskFactory.create).toHaveBeenCalledExactlyOnceWith(Need.Satiety);
  });

  it('Методы — жизненные потребности в порядке NEED_PRIORITY', () => {
    const task = new NeedsTask({
      satisfyNeedTaskFactory: createMockedSatisfyNeedTaskFactory(createStubTask('eat')),
    });

    expect(task.methods.map((method) => method.name)).toStrictEqual(
      NEED_PRIORITY.filter((need) => NEED_DEFINITIONS[need].category === NeedCategory.Vital)
    );
  });

  it('Если потребность срочная, планирует задачу её удовлетворения', () => {
    const task = new NeedsTask({
      satisfyNeedTaskFactory: createMockedSatisfyNeedTaskFactory(createStubTask('eat')),
    });

    expect(planNames(task, createHungryState())).toStrictEqual(['eat']);
  });

  it('Если срочных потребностей нет, план не составляется', () => {
    const task = new NeedsTask({
      satisfyNeedTaskFactory: createMockedSatisfyNeedTaskFactory(createStubTask('eat')),
    });
    const state = new NpcStateBuilder()
      .withNeeds({ [Need.Satiety]: NEED_DEFINITIONS[Need.Satiety].urgentBelow })
      .build();

    expect(planNames(task, state)).toBeNull();
  });

  it('Если срочную потребность удовлетворить нечем, план не составляется', () => {
    const task = new NeedsTask({
      satisfyNeedTaskFactory: createMockedSatisfyNeedTaskFactory(createStubTask('eat', false)),
    });

    expect(planNames(task, createHungryState())).toBeNull();
  });
});
