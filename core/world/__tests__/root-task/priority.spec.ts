import { createStubTask, planNames } from '@peetland/htn/dev';
import type { NpcContext, NpcState } from '@peetland/npc';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { RootTask } from '../../src/root-task';

type LayerName = 'needs' | 'addictions' | 'hobbies' | 'activity';

/** Создаёт корневую задачу, в которой можно спланировать любой слой, кроме переданных */
function createRootTask(unavailable: LayerName[] = []): RootTask {
  function stub(name: LayerName) {
    return createStubTask<NpcState, NpcContext>(name, !unavailable.includes(name));
  }

  return new RootTask({
    needs: stub('needs'),
    addictions: stub('addictions'),
    hobbies: stub('hobbies'),
    activity: stub('activity'),
  });
}

describe('RootTask', () => {
  describe('Порядок методов', () => {
    it('Если можно спланировать потребности, планирует потребности', () => {
      const names = planNames(createRootTask(), NpcStateBuilder.default());

      expect(names).toStrictEqual(['needs']);
    });

    it('Если потребности спланировать нельзя, планирует зависимости', () => {
      const names = planNames(createRootTask(['needs']), NpcStateBuilder.default());

      expect(names).toStrictEqual(['addictions']);
    });

    it('Если и зависимости спланировать нельзя, планирует хобби', () => {
      const names = planNames(createRootTask(['needs', 'addictions']), NpcStateBuilder.default());

      expect(names).toStrictEqual(['hobbies']);
    });

    it('Если и хобби спланировать нельзя, планирует деятельность', () => {
      const names = planNames(
        createRootTask(['needs', 'addictions', 'hobbies']),
        NpcStateBuilder.default()
      );

      expect(names).toStrictEqual(['activity']);
    });

    it('Если и деятельность спланировать нельзя, план не составляется', () => {
      const names = planNames(
        createRootTask(['needs', 'addictions', 'hobbies', 'activity']),
        NpcStateBuilder.default()
      );

      expect(names).toBeNull();
    });
  });
});
