import { AbortController } from '@peetland/events';
import { Npc } from '@peetland/npc';
import { createNpcData, createNpcDeps } from '@peetland/npc/dev';
import { createActor, createMockedActorFactory } from '@peetland/virtual-actor/dev';
import { describe, expect, it } from 'vitest';

import { ActorNpcRegistry } from '../src';

describe('ActorNpcRegistry', () => {
  describe('#getActor', () => {
    it('Возвращает актора, чьим телом является NPC', () => {
      const registry = new ActorNpcRegistry();
      const npc = new Npc(createNpcData(), createNpcDeps());
      const actor = createActor();
      registry.register(actor, npc, new AbortController().signal);

      expect(registry.getActor(npc)).toBe(actor);
    });

    it('Для NPC вне реестра возвращает undefined', () => {
      const registry = new ActorNpcRegistry();
      const npc = new Npc(createNpcData(), createNpcDeps());

      expect(registry.getActor(npc)).toBeUndefined();
    });
  });

  describe('#getNpc', () => {
    it('Возвращает NPC, чьим телом является актор', () => {
      const registry = new ActorNpcRegistry();
      const npc = new Npc(createNpcData(), createNpcDeps());
      const actor = createActor();
      registry.register(actor, npc, new AbortController().signal);

      expect(registry.getNpc(actor)).toBe(npc);
    });

    it('Для актора вне реестра возвращает undefined', () => {
      const registry = new ActorNpcRegistry();
      const actor = createActor();

      expect(registry.getNpc(actor)).toBeUndefined();
    });
  });

  describe('#register', () => {
    it('Когда сигнал прерван, убирает связь', () => {
      const registry = new ActorNpcRegistry();
      const npc = new Npc(createNpcData(), createNpcDeps());
      const actor = createActor();
      const lifetime = new AbortController();
      registry.register(actor, npc, lifetime.signal);

      lifetime.abort();

      expect(registry.getActor(npc)).toBeUndefined();
      expect(registry.getNpc(actor)).toBeUndefined();
    });

    it('Когда NPC деспавнится, убирает связь', () => {
      const registry = new ActorNpcRegistry();
      const actor = createActor();
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({
          actorNpcRegistry: registry,
          actorFactory: createMockedActorFactory(actor),
        })
      );

      npc.despawn();

      expect(registry.getActor(npc)).toBeUndefined();
      expect(registry.getNpc(actor)).toBeUndefined();
    });
  });
});
