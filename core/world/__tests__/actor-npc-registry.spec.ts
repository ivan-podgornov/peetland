import { Npc } from '@peetland/npc';
import { createNpcData, createNpcDeps } from '@peetland/npc/dev';
import { createActor } from '@peetland/virtual-actor/dev';
import { describe, expect, it } from 'vitest';

import { ActorNpcRegistry } from '../src';

describe('ActorNpcRegistry', () => {
  describe('#getActor', () => {
    it('Возвращает актора, который является телом NPC', () => {
      const registry = new ActorNpcRegistry();
      const npc = new Npc(createNpcData(), createNpcDeps());
      const actor = createActor();
      registry.register(actor, npc);

      expect(registry.getActor(npc)).toBe(actor);
    });

    it('Бросает ошибку, когда NPC не в реестре', () => {
      const registry = new ActorNpcRegistry();
      const npc = new Npc(createNpcData(), createNpcDeps());

      expect(() => registry.getActor(npc)).toThrow('NPC не в реестре');
    });
  });

  describe('#getNpc', () => {
    it('Возвращает NPC, чьим телом является актор', () => {
      const registry = new ActorNpcRegistry();
      const npc = new Npc(createNpcData(), createNpcDeps());
      const actor = createActor();
      registry.register(actor, npc);

      expect(registry.getNpc(actor)).toBe(npc);
    });

    it('Бросает ошибку, когда у актора нет NPC в реестре', () => {
      const registry = new ActorNpcRegistry();
      const actor = createActor();

      expect(() => registry.getNpc(actor)).toThrow('У актора нет NPC в реестре');
    });
  });

  describe('#register', () => {
    it('Когда NPC деспавнится, убирает связь', () => {
      const registry = new ActorNpcRegistry();
      const actor = createActor();
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({
          actorNpcRegistry: registry,
          actor,
        })
      );

      npc.despawn();

      expect(() => registry.getActor(npc)).toThrow('NPC не в реестре');
      expect(() => registry.getNpc(actor)).toThrow('У актора нет NPC в реестре');
    });
  });
});
