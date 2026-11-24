import { createControlledObservable } from '@peetland/events/dev';
import { createMockedHTN } from '@peetland/htn/dev';
import { Needs } from '@peetland/needs';
import { createNeedsDeps, createNeedsState } from '@peetland/needs/dev';
import { describe, expect, it } from 'vitest';

import { createNpcData, createNpcDeps } from '../dev';
import { Npc } from '../src';
import type { NpcContext, NpcState } from '../src';

describe('Npc', () => {
  describe('Потребности', () => {
    it('getState возвращает потребности NPC', () => {
      const needs = new Needs(createNeedsState(), createNeedsDeps());
      const data = createNpcData();
      const npc = new Npc(data.id, data.kind, createNpcDeps({ needs }));

      expect(npc.getState().self.needs).toBe(needs);
    });

    it('Вызывает htn.update с контекстом, в котором потребности NPC', () => {
      const ticks = createControlledObservable();
      const htn = createMockedHTN<NpcState, NpcContext>();
      const data = createNpcData();
      const npc = new Npc(
        data.id,
        data.kind,
        createNpcDeps({
          htn,
          ticks: ticks.observable,
        })
      );

      ticks.subscriber.next(undefined);

      expect(htn.update).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ needs: npc.needs })
      );
    });
  });
});
