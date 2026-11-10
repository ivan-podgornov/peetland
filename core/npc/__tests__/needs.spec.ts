import { createControlledObservable } from '@peetland/events/dev';
import { createMockedHTN, createMockedHTNFactory } from '@peetland/htn/dev';
import { Need, Needs } from '@peetland/needs';
import { createMockedNeedsFactory, createNeedsDeps } from '@peetland/needs/dev';
import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { createMockedNpcWorldKnowledge, createNpcData, createNpcDeps } from '../dev';
import { Npc } from '../src';
import type { NpcContext, NpcState } from '../src';

describe('Npc', () => {
  describe('Потребности', () => {
    it('Вызывает needsFactory.create с начальными потребностями из данных и временем мира', () => {
      const needsFactory = createMockedNeedsFactory();
      const time = new ManualTime({
        day: 3,
        hours: 8,
        minutes: 0,
      });
      const data = createNpcData({ needs: { [Need.Satiety]: 70 } });

      new Npc(
        data,
        createNpcDeps({
          needsFactory,
          worldKnowledge: createMockedNpcWorldKnowledge({ time }),
        })
      );

      expect(needsFactory.create).toHaveBeenCalledExactlyOnceWith(data.needs, time);
    });

    it('Использует потребности, которые вернула needsFactory', () => {
      const needs = new Needs({}, createNeedsDeps());

      const npc = new Npc(
        createNpcData(),
        createNpcDeps({ needsFactory: createMockedNeedsFactory(needs) })
      );

      expect(npc.needs).toBe(needs);
    });

    it('getState возвращает потребности NPC', () => {
      const needs = new Needs({}, createNeedsDeps());
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({ needsFactory: createMockedNeedsFactory(needs) })
      );

      expect(npc.getState().self.needs).toBe(needs);
    });

    it('Вызывает htn.update с контекстом, в котором потребности NPC', () => {
      const ticks = createControlledObservable();
      const htn = createMockedHTN<NpcState, NpcContext>();
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({
          htnFactory: createMockedHTNFactory(htn),
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
