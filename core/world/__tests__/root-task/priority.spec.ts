import { createStubTask, planSteps, PlanStructureBuilder, planTree } from '@peetland/htn/dev';
import type { NpcContext, NpcState } from '@peetland/npc';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { RootTask } from '../../src/root-task';

type LayerName = 'needs' | 'addictions' | 'activity' | 'hobbies';

/** Создаёт корневую задачу, в которой можно спланировать любой слой, кроме переданных */
function createRootTask(unavailable: LayerName[] = []): RootTask {
  function stub(name: LayerName) {
    return createStubTask<NpcState, NpcContext>(name, !unavailable.includes(name));
  }

  return new RootTask({
    needs: stub('needs'),
    addictions: stub('addictions'),
    activity: stub('activity'),
    hobbies: stub('hobbies'),
  });
}

describe('RootTask', () => {
  describe('Порядок методов', () => {
    it('Если можно спланировать потребности, планирует потребности', () => {
      const tree = planTree(planSteps(createRootTask(), NpcStateBuilder.default()) ?? []);

      expect(tree).toStrictEqual(
        new PlanStructureBuilder()
          .compound('live', 'needs', (method) => method.primitive('needs'))
          .build()
      );
    });

    it('Если потребности спланировать нельзя, планирует зависимости', () => {
      const tree = planTree(planSteps(createRootTask(['needs']), NpcStateBuilder.default()) ?? []);

      expect(tree).toStrictEqual(
        new PlanStructureBuilder()
          .compound('live', 'addictions', (method) => method.primitive('addictions'))
          .build()
      );
    });

    it('Если и зависимости спланировать нельзя, планирует деятельность', () => {
      const tree = planTree(
        planSteps(createRootTask(['needs', 'addictions']), NpcStateBuilder.default()) ?? []
      );

      expect(tree).toStrictEqual(
        new PlanStructureBuilder()
          .compound('live', 'activity', (method) => method.primitive('activity'))
          .build()
      );
    });

    it('Если и деятельность спланировать нельзя, планирует хобби', () => {
      const tree = planTree(
        planSteps(createRootTask(['needs', 'addictions', 'activity']), NpcStateBuilder.default()) ??
          []
      );

      expect(tree).toStrictEqual(
        new PlanStructureBuilder()
          .compound('live', 'hobbies', (method) => method.primitive('hobbies'))
          .build()
      );
    });

    it('Если и хобби спланировать нельзя, план не составляется', () => {
      const steps = planSteps(
        createRootTask(['needs', 'addictions', 'activity', 'hobbies']),
        NpcStateBuilder.default()
      );

      expect(steps).toBeNull();
    });
  });
});
