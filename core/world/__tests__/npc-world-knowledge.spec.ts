import { Npc } from '@peetland/npc';
import { createMockedActorNpcRegistry, createNpcData, createNpcDeps } from '@peetland/npc/dev';
import { ManualTime } from '@peetland/timings';
import { createActor } from '@peetland/virtual-actor/dev';
import { describe, expect, it, vi } from 'vitest';

import { createGame } from '../dev';
import { ActorNpcRegistry } from '../src/actor-npc-registry';
import { NpcWorldKnowledge, NpcWorldKnowledgeFactory } from '../src/npc-world-knowledge';

describe('NpcWorldKnowledge', () => {
  describe('#time', () => {
    it('Возвращает время суток', () => {
      const time = new ManualTime();
      const actorNpcRegistry = new ActorNpcRegistry();
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({
          actorNpcRegistry,
          actor: createActor(),
        })
      );
      const knowledge = new NpcWorldKnowledge(npc, {
        time,
        game: createGame(),
        actorNpcRegistry,
      });

      expect(knowledge.time).toBe(time);
    });
  });

  describe('#getVisibleNpcs', () => {
    it('Возвращает NPC, которых видит NPC в радиусе radius', () => {
      const actorNpcRegistry = new ActorNpcRegistry();
      const actor = createActor();
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({
          actorNpcRegistry,
          actor,
        })
      );
      const visibleActor = createActor();
      const visibleNpc = new Npc(
        createNpcData(),
        createNpcDeps({
          actorNpcRegistry,
          actor: visibleActor,
        })
      );
      const game = createGame({ getVisibleActors: vi.fn(() => [visibleActor]) });
      const knowledge = new NpcWorldKnowledge(npc, {
        time: new ManualTime(),
        game,
        actorNpcRegistry,
      });

      expect(knowledge.getVisibleNpcs(10)).toStrictEqual([visibleNpc]);
      expect(game.getVisibleActors).toHaveBeenCalledExactlyOnceWith(actor, 10);
    });

    it('Бросает ошибку, когда NPC не в реестре', () => {
      const actorNpcRegistry = new ActorNpcRegistry();
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({
          actorNpcRegistry: createMockedActorNpcRegistry(),
          actor: createActor(),
        })
      );
      const game = createGame();
      const knowledge = new NpcWorldKnowledge(npc, {
        time: new ManualTime(),
        game,
        actorNpcRegistry,
      });

      expect(() => knowledge.getVisibleNpcs(10)).toThrow('NPC не в реестре');
      expect(game.getVisibleActors).not.toHaveBeenCalled();
    });
  });
});

describe('NpcWorldKnowledgeFactory', () => {
  describe('#create', () => {
    it('Создаёт знание, которое видит мир глазами переданного NPC', () => {
      const actorNpcRegistry = new ActorNpcRegistry();
      const actor = createActor();
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({
          actorNpcRegistry,
          actor,
        })
      );
      const visibleActor = createActor();
      const visibleNpc = new Npc(
        createNpcData(),
        createNpcDeps({
          actorNpcRegistry,
          actor: visibleActor,
        })
      );
      const game = createGame({ getVisibleActors: vi.fn(() => [visibleActor]) });
      const factory = new NpcWorldKnowledgeFactory({
        time: new ManualTime(),
        game,
        actorNpcRegistry,
      });

      const knowledge = factory.create(npc);

      expect(knowledge.getVisibleNpcs(10)).toStrictEqual([visibleNpc]);
      expect(game.getVisibleActors).toHaveBeenCalledExactlyOnceWith(actor, 10);
    });
  });
});
