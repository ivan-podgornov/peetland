import { Need, Needs } from '@peetland/needs';
import {
  createMockedNeedsFactory,
  createNeedValues,
  createNeedsDeps,
  createNeedsState,
} from '@peetland/needs/dev';
import { describe, expect, it } from 'vitest';

import { createNpcData } from '../../dev';
import { NpcFactory } from '../../src';

import { createRequiredDeps } from './helpers';

describe('NpcFactory', () => {
  describe('#create', () => {
    it('Вызывает needsFactory.create с начальными потребностями из данных', () => {
      const needsFactory = createMockedNeedsFactory();
      const data = createNpcData({ needs: createNeedValues({ [Need.Satiety]: 70 }) });
      const factory = new NpcFactory(createRequiredDeps({ needsFactory }));

      factory.create(data);

      expect(needsFactory.create).toHaveBeenCalledExactlyOnceWith(data.needs);
    });

    it('Передаёт NPC потребности, которые вернула needsFactory', () => {
      const needs = new Needs(createNeedsState(), createNeedsDeps());
      const factory = new NpcFactory(
        createRequiredDeps({ needsFactory: createMockedNeedsFactory(needs) })
      );

      const npc = factory.create(createNpcData());

      expect(npc.getState().self.needs).toBe(needs);
    });
  });
});
