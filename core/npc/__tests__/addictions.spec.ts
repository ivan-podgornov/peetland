import { Addiction, Addictions } from '@peetland/addictions';
import {
  createAddictionsData,
  createAddictionsDeps,
  createAddictionsState,
  createMockedAddictionsFactory,
} from '@peetland/addictions/dev';
import { createControlledObservable } from '@peetland/events/dev';
import { createMockedHTN, createMockedHTNFactory } from '@peetland/htn/dev';
import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { createMockedNpcWorldKnowledge, createNpcData, createNpcDeps } from '../dev';
import { Npc } from '../src';
import type { NpcContext, NpcState } from '../src';

describe('Npc', () => {
  describe('Зависимости', () => {
    it('Вызывает addictionsFactory.create с начальными зависимостями из данных и временем мира', () => {
      const addictionsFactory = createMockedAddictionsFactory();
      const time = new ManualTime({
        day: 3,
        hours: 8,
        minutes: 0,
      });
      const data = createNpcData({
        addictions: createAddictionsData({
          [Addiction.Alcoholism]: {
            satisfaction: 70,
            strength: 40,
          },
        }),
      });

      new Npc(
        data,
        createNpcDeps({
          addictionsFactory,
          worldKnowledge: createMockedNpcWorldKnowledge({ time }),
        })
      );

      expect(addictionsFactory.create).toHaveBeenCalledExactlyOnceWith(data.addictions, time);
    });

    it('Использует зависимости, которые вернула addictionsFactory', () => {
      const addictions = new Addictions(createAddictionsState(), createAddictionsDeps());

      const npc = new Npc(
        createNpcData(),
        createNpcDeps({ addictionsFactory: createMockedAddictionsFactory(addictions) })
      );

      expect(npc.addictions).toBe(addictions);
    });

    it('getState возвращает зависимости NPC', () => {
      const addictions = new Addictions(createAddictionsState(), createAddictionsDeps());
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({ addictionsFactory: createMockedAddictionsFactory(addictions) })
      );

      expect(npc.getState().self.addictions).toBe(addictions);
    });

    it('Вызывает htn.update с контекстом, в котором зависимости NPC', () => {
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
        expect.objectContaining({ addictions: npc.addictions })
      );
    });
  });
});
