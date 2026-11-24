import { Addiction, Addictions } from '@peetland/addictions';
import {
  createAddictionsData,
  createAddictionsDeps,
  createAddictionsState,
  createMockedAddictionsFactory,
} from '@peetland/addictions/dev';
import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { createMockedNpcWorldKnowledge, createNpcData } from '../../dev';
import { NpcFactory } from '../../src';

import { createRequiredDeps } from './helpers';

describe('NpcFactory', () => {
  describe('#create', () => {
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
      const factory = new NpcFactory(
        createRequiredDeps({
          addictionsFactory,
          worldKnowledge: createMockedNpcWorldKnowledge({ time }),
        })
      );

      factory.create(data);

      expect(addictionsFactory.create).toHaveBeenCalledExactlyOnceWith(data.addictions, time);
    });

    it('Передаёт NPC зависимости, которые вернула addictionsFactory', () => {
      const addictions = new Addictions(createAddictionsState(), createAddictionsDeps());
      const factory = new NpcFactory(
        createRequiredDeps({ addictionsFactory: createMockedAddictionsFactory(addictions) })
      );

      const npc = factory.create(createNpcData());

      expect(npc.getState().self.addictions).toBe(addictions);
    });

    it('Если addictionsFactory не передана, NPC получает экземпляр Addictions', () => {
      const factory = new NpcFactory(createRequiredDeps());

      const npc = factory.create(createNpcData());

      expect(npc.getState().self.addictions).toBeInstanceOf(Addictions);
    });
  });
});
