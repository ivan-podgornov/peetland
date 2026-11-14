import { createStubTask, planSteps, PlanStructureBuilder, planTree } from '@peetland/htn/dev';
import type { NpcContext, NpcState } from '@peetland/npc';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { createHomelessTaskFactory } from '../../dev';
import { HomelessActivityTask } from '../../src';

type HomelessTaskName = 'drink' | 'buy-booze' | 'sell-bottles' | 'beg' | 'collect-bottles';

/** Создаёт деятельность бомжа, в которой можно выполнить любую задачу бомжа, кроме переданных */
function createActivityTask(unavailable: HomelessTaskName[] = []): HomelessActivityTask {
  function stub(name: HomelessTaskName) {
    return () => createStubTask<NpcState, NpcContext>(name, !unavailable.includes(name));
  }

  return new HomelessActivityTask({
    homelessTaskFactory: createHomelessTaskFactory({
      drink: stub('drink'),
      buyBooze: stub('buy-booze'),
      sellBottles: stub('sell-bottles'),
      beg: stub('beg'),
      collectBottles: stub('collect-bottles'),
    }),
  });
}

describe('HomelessActivityTask', () => {
  describe('Порядок методов', () => {
    it('Если можно бухать, планирует бухать', () => {
      const tree = planTree(planSteps(createActivityTask(), NpcStateBuilder.default()) ?? []);

      expect(tree).toStrictEqual(
        new PlanStructureBuilder()
          .compound('get-drunk', 'drink', (method) => method.primitive('drink'))
          .build()
      );
    });

    it('Если бухать нельзя, планирует купить пойло', () => {
      const tree = planTree(
        planSteps(createActivityTask(['drink']), NpcStateBuilder.default()) ?? []
      );

      expect(tree).toStrictEqual(
        new PlanStructureBuilder()
          .compound('get-drunk', 'buy-booze', (method) => method.primitive('buy-booze'))
          .build()
      );
    });

    it('Если и купить пойло нельзя, планирует сдать бутылки', () => {
      const tree = planTree(
        planSteps(createActivityTask(['drink', 'buy-booze']), NpcStateBuilder.default()) ?? []
      );

      expect(tree).toStrictEqual(
        new PlanStructureBuilder()
          .compound('get-drunk', 'sell-bottles', (method) => method.primitive('sell-bottles'))
          .build()
      );
    });

    it('Если и сдать бутылки нельзя, планирует клянчить', () => {
      const tree = planTree(
        planSteps(
          createActivityTask(['drink', 'buy-booze', 'sell-bottles']),
          NpcStateBuilder.default()
        ) ?? []
      );

      expect(tree).toStrictEqual(
        new PlanStructureBuilder()
          .compound('get-drunk', 'beg', (method) => method.primitive('beg'))
          .build()
      );
    });

    it('Если и клянчить нельзя, планирует собирать бутылки', () => {
      const tree = planTree(
        planSteps(
          createActivityTask(['drink', 'buy-booze', 'sell-bottles', 'beg']),
          NpcStateBuilder.default()
        ) ?? []
      );

      expect(tree).toStrictEqual(
        new PlanStructureBuilder()
          .compound('get-drunk', 'collect-bottles', (method) => method.primitive('collect-bottles'))
          .build()
      );
    });

    it('Если и собирать бутылки нельзя, план не составляется', () => {
      const steps = planSteps(
        createActivityTask(['drink', 'buy-booze', 'sell-bottles', 'beg', 'collect-bottles']),
        NpcStateBuilder.default()
      );

      expect(steps).toBeNull();
    });
  });
});
