import { Need, Needs } from '@peetland/needs';
import {
  createMockedNeedsFactory,
  createNeedValues,
  createNeedsDeps,
  createNeedsState,
} from '@peetland/needs/dev';
import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { createMockedNpcWorldKnowledge, createNpcData } from '../../dev';
import { NpcFactory } from '../../src';

import { createRequiredDeps } from './helpers';

describe('NpcFactory', () => {
  describe('#create', () => {
    it('Вызывает needsFactory.create с начальными потребностями из данных и временем мира', () => {
      const needsFactory = createMockedNeedsFactory();
      const time = new ManualTime({
        day: 3,
        hours: 8,
        minutes: 0,
      });
      const data = createNpcData({ needs: createNeedValues({ [Need.Satiety]: 70 }) });
      const factory = new NpcFactory(
        createRequiredDeps({
          needsFactory,
          worldKnowledge: createMockedNpcWorldKnowledge({ time }),
        })
      );

      factory.create(data);

      expect(needsFactory.create).toHaveBeenCalledExactlyOnceWith(data.needs, time);
    });

    it('Передаёт NPC потребности, которые вернула needsFactory', () => {
      const needs = new Needs(createNeedsState(), createNeedsDeps());
      const factory = new NpcFactory(
        createRequiredDeps({ needsFactory: createMockedNeedsFactory(needs) })
      );

      const npc = factory.create(createNpcData());

      expect(npc.getState().self.needs).toBe(needs);
    });

    it('Если needsFactory не передана, NPC получает экземпляр Needs', () => {
      const factory = new NpcFactory(createRequiredDeps());

      const npc = factory.create(createNpcData());

      expect(npc.getState().self.needs).toBeInstanceOf(Needs);
    });
  });
});
