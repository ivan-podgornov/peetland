import { Memory } from '@peetland/memory';
import { createMockedMemoryFactory } from '@peetland/memory/dev';
import { describe, expect, it } from 'vitest';

import { createNpcData } from '../../dev';
import { NpcFactory } from '../../src';

import { createRequiredDeps } from './helpers';

describe('NpcFactory', () => {
  describe('#create', () => {
    it('Вызывает memoryFactory.create', () => {
      const memoryFactory = createMockedMemoryFactory();
      const factory = new NpcFactory(createRequiredDeps({ memoryFactory }));

      factory.create(createNpcData());

      expect(memoryFactory.create).toHaveBeenCalledExactlyOnceWith();
    });

    it('Передаёт NPC память, которую вернула memoryFactory', () => {
      const memoryFactory = createMockedMemoryFactory();
      const factory = new NpcFactory(createRequiredDeps({ memoryFactory }));

      const npc = factory.create(createNpcData());

      expect(npc.getState().self.memory).toBe(memoryFactory.create());
    });

    it('Если memoryFactory не передана, NPC получает экземпляр Memory', () => {
      const factory = new NpcFactory(createRequiredDeps());

      const npc = factory.create(createNpcData());

      expect(npc.getState().self.memory).toBeInstanceOf(Memory);
    });
  });
});
