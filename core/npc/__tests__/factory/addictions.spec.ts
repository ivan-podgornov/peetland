import { Addiction, Addictions } from '@peetland/addictions';
import {
  createAddictionsData,
  createAddictionsDeps,
  createAddictionsState,
  createMockedAddictionsFactory,
} from '@peetland/addictions/dev';
import { describe, expect, it } from 'vitest';

import { createNpcData } from '../../dev';
import { NpcFactory } from '../../src';

import { createRequiredDeps } from './helpers';

describe('NpcFactory', () => {
  describe('#create', () => {
    it('Вызывает addictionsFactory.create с начальными зависимостями из данных', () => {
      const addictionsFactory = createMockedAddictionsFactory();
      const data = createNpcData({
        addictions: createAddictionsData({
          [Addiction.Alcoholism]: {
            satisfaction: 70,
            strength: 40,
          },
        }),
      });
      const factory = new NpcFactory(createRequiredDeps({ addictionsFactory }));

      factory.create(data);

      expect(addictionsFactory.create).toHaveBeenCalledExactlyOnceWith(data.addictions);
    });

    it('Передаёт NPC зависимости, которые вернула addictionsFactory', () => {
      const addictions = new Addictions(createAddictionsState(), createAddictionsDeps());
      const factory = new NpcFactory(
        createRequiredDeps({ addictionsFactory: createMockedAddictionsFactory(addictions) })
      );

      const npc = factory.create(createNpcData());

      expect(npc.getState().self.addictions).toBe(addictions);
    });
  });
});
