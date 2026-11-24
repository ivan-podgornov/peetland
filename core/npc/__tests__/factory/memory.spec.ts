import { Memory } from '@peetland/memory';
import type { IMemoryFactory } from '@peetland/memory';
import { ManualTime } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { createMockedNpcWorldKnowledge, createNpcData } from '../../dev';
import { NpcFactory } from '../../src';

import { createRequiredDeps } from './helpers';

describe('NpcFactory', () => {
  describe('#create', () => {
    it('Вызывает memoryFactory.create с временем мира', () => {
      const memory = new Memory({ time: new ManualTime() });
      const memoryFactory: IMemoryFactory = { create: vi.fn(() => memory) };
      const time = new ManualTime({
        day: 3,
        hours: 8,
        minutes: 0,
      });
      const factory = new NpcFactory(
        createRequiredDeps({
          memoryFactory,
          worldKnowledge: createMockedNpcWorldKnowledge({ time }),
        })
      );

      factory.create(createNpcData());

      expect(memoryFactory.create).toHaveBeenCalledExactlyOnceWith(time);
    });

    it('Передаёт NPC память, которую вернула memoryFactory', () => {
      const memory = new Memory({ time: new ManualTime() });
      const memoryFactory: IMemoryFactory = { create: vi.fn(() => memory) };
      const factory = new NpcFactory(createRequiredDeps({ memoryFactory }));

      const npc = factory.create(createNpcData());

      expect(npc.getState().self.memory).toBe(memory);
    });

    it('Если memoryFactory не передана, NPC получает экземпляр Memory', () => {
      const factory = new NpcFactory(createRequiredDeps());

      const npc = factory.create(createNpcData());

      expect(npc.getState().self.memory).toBeInstanceOf(Memory);
    });
  });
});
