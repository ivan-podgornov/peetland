import { Feeling, Psyche } from '@peetland/psyche';
import {
  createMockedPsycheFactory,
  createPsycheDeps,
  createPsycheState,
} from '@peetland/psyche/dev';
import { describe, expect, it } from 'vitest';

import { createNpcData } from '../../dev';
import { NpcFactory } from '../../src';

import { createRequiredDeps } from './helpers';

describe('NpcFactory', () => {
  describe('#create', () => {
    it('Вызывает psycheFactory.create с начальным состоянием психики из данных', () => {
      const psycheFactory = createMockedPsycheFactory();
      const data = createNpcData({
        psyche: createPsycheState({
          feelings: { [Feeling.Shame]: 30 },
        }),
      });
      const factory = new NpcFactory(createRequiredDeps({ psycheFactory }));

      factory.create(data);

      expect(psycheFactory.create).toHaveBeenCalledExactlyOnceWith(data.psyche);
    });

    it('Передаёт NPC психику, которую вернула psycheFactory', () => {
      const psyche = new Psyche(createPsycheState(), createPsycheDeps());
      const factory = new NpcFactory(
        createRequiredDeps({ psycheFactory: createMockedPsycheFactory(psyche) })
      );

      const npc = factory.create(createNpcData());

      expect(npc.getState().self.psyche).toBe(psyche);
    });

    it('Если psycheFactory не передана, NPC получает экземпляр Psyche', () => {
      const factory = new NpcFactory(createRequiredDeps());

      const npc = factory.create(createNpcData());

      expect(npc.getState().self.psyche).toBeInstanceOf(Psyche);
    });
  });
});
