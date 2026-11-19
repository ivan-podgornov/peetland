import { createStubTask, planSteps, PlanStructureBuilder, planTree } from '@peetland/htn/dev';
import type { NpcContext, NpcState } from '@peetland/npc';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { createHomelessTaskFactory } from '../../dev';
import { HomelessActivityTask } from '../../src';

type HomelessTaskName = 'sell-bottles' | 'beg' | 'collect-bottles';

/** Создаёт деятельность бомжа, в которой можно выполнить любую задачу бомжа, кроме переданных */
function createActivityTask(unavailable: HomelessTaskName[] = []): HomelessActivityTask {
  function stub(name: HomelessTaskName) {
    return () => createStubTask<NpcState, NpcContext>(name, !unavailable.includes(name));
  }

  return new HomelessActivityTask({
    homelessTaskFactory: createHomelessTaskFactory({
      sellBottles: stub('sell-bottles'),
      beg: stub('beg'),
      collectBottles: stub('collect-bottles'),
    }),
  });
}

/** Планирует деятельность бомжа, в которой нельзя выполнить переданные задачи */
function planActivity(unavailable: HomelessTaskName[] = []) {
  return planTree(planSteps(createActivityTask(unavailable), NpcStateBuilder.default()) ?? []);
}

/** Структура плана деятельности, в которой выбран метод с задачей name */
function activityPlan(name: HomelessTaskName) {
  return new PlanStructureBuilder()
    .compound('scrape-by', name, (method) => method.primitive(name))
    .build();
}

describe('HomelessActivityTask', () => {
  describe('Порядок методов', () => {
    it('Если можно сдать бутылки, планирует сдать бутылки', () => {
      expect(planActivity()).toStrictEqual(activityPlan('sell-bottles'));
    });

    it('Если сдать бутылки нельзя, планирует клянчить', () => {
      expect(planActivity(['sell-bottles'])).toStrictEqual(activityPlan('beg'));
    });

    it('Если и клянчить нельзя, планирует собирать бутылки', () => {
      expect(planActivity(['sell-bottles', 'beg'])).toStrictEqual(activityPlan('collect-bottles'));
    });

    it('Если и собирать бутылки нельзя, план не составляется', () => {
      const steps = planSteps(
        createActivityTask(['sell-bottles', 'beg', 'collect-bottles']),
        NpcStateBuilder.default()
      );

      expect(steps).toBeNull();
    });
  });
});
