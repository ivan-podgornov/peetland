import { describe, expect, it } from 'vitest';

import { createNpcData, createNpcDeps } from '../dev';
import { Npc, NpcFactory } from '../src';

describe('NpcFactory', () => {
  describe('#create', () => {
    it('Возвращает экземпляр Npc', () => {
      const factory = new NpcFactory(createNpcDeps());

      const npc = factory.create(createNpcData());

      expect(npc).toBeInstanceOf(Npc);
    });
  });
});
