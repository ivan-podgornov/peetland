import { Addictions } from '@peetland/addictions';
import { createAddictionsDeps, createAddictionsState } from '@peetland/addictions/dev';
import { createControlledObservable } from '@peetland/events/dev';
import { createMockedHTN } from '@peetland/htn/dev';
import { describe, expect, it } from 'vitest';

import { createNpcData, createNpcDeps } from '../dev';
import { Npc } from '../src';
import type { NpcContext, NpcState } from '../src';

describe('Npc', () => {
  describe('Зависимости', () => {
    it('getState возвращает зависимости NPC', () => {
      const addictions = new Addictions(createAddictionsState(), createAddictionsDeps());
      const data = createNpcData();
      const npc = new Npc(data.id, data.kind, createNpcDeps({ addictions }));

      expect(npc.getState().self.addictions).toBe(addictions);
    });

    it('Вызывает htn.update с контекстом, в котором зависимости NPC', () => {
      const ticks = createControlledObservable();
      const htn = createMockedHTN<NpcState, NpcContext>();
      const addictions = new Addictions(createAddictionsState(), createAddictionsDeps());
      const data = createNpcData();
      new Npc(
        data.id,
        data.kind,
        createNpcDeps({
          htn,
          addictions,
          ticks: ticks.observable,
        })
      );

      ticks.subscriber.next(undefined);

      expect(htn.update).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ addictions })
      );
    });
  });
});
