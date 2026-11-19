import { Addiction } from '@peetland/addictions';
import { createStubTask, planSteps, PlanStructureBuilder, planTree } from '@peetland/htn/dev';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { createMockedAddictionsTaskFactory } from '../dev';
import { AddictionsTask } from '../src';

/** Создаёт состояние NPC с максимальным алкоголизмом и переданной удовлетворённостью */
function createStateWithAlcoholism(satisfaction: number) {
  return new NpcStateBuilder()
    .withAddictions((addictions) =>
      addictions
        .withStrength(Addiction.Alcoholism, 100)
        .withSatisfaction(Addiction.Alcoholism, satisfaction)
        .build()
    )
    .build();
}

describe('AddictionsTask', () => {
  it('Создаёт SatisfyAlcoholismTask фабрикой addictionsTaskFactory', () => {
    const addictionsTaskFactory = createMockedAddictionsTaskFactory();

    new AddictionsTask({ addictionsTaskFactory });

    expect(addictionsTaskFactory.satisfyAlcoholism).toHaveBeenCalledOnce();
  });

  describe('Метод satisfy-alcoholism', () => {
    it('Если тянет выпить, планирует SatisfyAlcoholismTask', () => {
      const task = new AddictionsTask({
        addictionsTaskFactory: createMockedAddictionsTaskFactory(),
      });

      expect(planTree(planSteps(task, createStateWithAlcoholism(10)) ?? [])).toStrictEqual(
        new PlanStructureBuilder()
          .compound('addictions', 'satisfy-alcoholism', (method) =>
            method.primitive('satisfy-alcoholism')
          )
          .build()
      );
    });

    it('Если выпить не тянет, план не составляется', () => {
      const task = new AddictionsTask({
        addictionsTaskFactory: createMockedAddictionsTaskFactory(),
      });

      expect(planSteps(task, createStateWithAlcoholism(40))).toBeNull();
    });

    it('Если тянет, а SatisfyAlcoholismTask не спланировать, план не составляется', () => {
      const task = new AddictionsTask({
        addictionsTaskFactory: createMockedAddictionsTaskFactory({
          satisfyAlcoholism: () => createStubTask('satisfy-alcoholism', false),
        }),
      });

      expect(planSteps(task, createStateWithAlcoholism(10))).toBeNull();
    });
  });
});
