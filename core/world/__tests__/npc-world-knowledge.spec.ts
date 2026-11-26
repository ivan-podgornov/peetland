import { Npc } from '@peetland/npc';
import { createNpcData, createNpcDeps } from '@peetland/npc/dev';
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
      const knowledge = new NpcWorldKnowledge(createActor(), {
        time,
        game: createGame(),
        actorNpcRegistry: new ActorNpcRegistry(),
      });

      expect(knowledge.time).toBe(time);
    });
  });

  describe('#getVisibleNpcs', () => {
    it('Возвращает NPC, которых видит NPC в радиусе radius', () => {
      const actorNpcRegistry = new ActorNpcRegistry();
      const actor = createActor();
      const visibleActor = createActor();
      const visibleNpc = new Npc(
        createNpcData(),
        createNpcDeps({
          actorNpcRegistry,
          actor: visibleActor,
        })
      );
      const game = createGame({ getVisibleActors: vi.fn(() => [visibleActor]) });
      const knowledge = new NpcWorldKnowledge(actor, {
        time: new ManualTime(),
        game,
        actorNpcRegistry,
      });

      expect(knowledge.getVisibleNpcs(10)).toStrictEqual([visibleNpc]);
      expect(game.getVisibleActors).toHaveBeenCalledExactlyOnceWith(actor, 10);
    });

    it('Бросает ошибку, когда видимый актор без личности', () => {
      const actorNpcRegistry = new ActorNpcRegistry();
      const visibleActor = createActor();
      const game = createGame({ getVisibleActors: vi.fn(() => [visibleActor]) });
      const knowledge = new NpcWorldKnowledge(createActor(), {
        time: new ManualTime(),
        game,
        actorNpcRegistry,
      });

      expect(() => knowledge.getVisibleNpcs(10)).toThrow('У актора нет NPC в реестре');
    });
  });
});

describe('NpcWorldKnowledgeFactory', () => {
  describe('#create', () => {
    it('Создаёт знание, которое видит мир глазами переданного актора', () => {
      const actorNpcRegistry = new ActorNpcRegistry();
      const actor = createActor();
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

      const knowledge = factory.create(actor);

      expect(knowledge.getVisibleNpcs(10)).toStrictEqual([visibleNpc]);
      expect(game.getVisibleActors).toHaveBeenCalledExactlyOnceWith(actor, 10);
    });
  });
});
