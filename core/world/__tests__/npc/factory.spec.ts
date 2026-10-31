import { describe, expect, it } from 'vitest';

import { Npc, NpcFactory } from '../../src';

import { createNpcData, createNpcDeps } from './helpers';

describe('NpcFactory', () => {
  describe('#create', () => {
    it('Возвращает экземпляр Npc', () => {
      const factory = new NpcFactory(createNpcDeps());

      const npc = factory.create(createNpcData());

      expect(npc).toBeInstanceOf(Npc);
    });
  });
});
