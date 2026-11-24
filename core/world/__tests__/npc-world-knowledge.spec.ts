import { Npc } from '@peetland/npc';
import { createMockedActorNpcRegistry, createNpcData, createNpcDeps } from '@peetland/npc/dev';
import { ManualTime } from '@peetland/timings';
import { createActor } from '@peetland/virtual-actor/dev';
import { describe, expect, it, vi } from 'vitest';

import { createGame } from '../dev';
import { ActorNpcRegistry } from '../src/actor-npc-registry';
import { NpcWorldKnowledge } from '../src/npc-world-knowledge';

describe('NpcWorldKnowledge', () => {
  describe('#getState', () => {
    it('Возвращает время суток', () => {
      const time = new ManualTime();
      const knowledge = new NpcWorldKnowledge({
        time,
        game: createGame(),
        actorNpcRegistry: new ActorNpcRegistry(),
      });

      expect(knowledge.getState().time).toBe(time);
    });
  });

  describe('#getVisibleNpcs', () => {
    it('Возвращает NPC, которых видит target в радиусе radius', () => {
      const actorNpcRegistry = new ActorNpcRegistry();
      const actor = createActor();
      const data = createNpcData();
      const npc = new Npc(
        data,
        createNpcDeps({
          actorNpcRegistry,
          actor,
        })
      );
      const visibleActor = createActor();
      const visibleData = createNpcData();
      const visibleNpc = new Npc(
        visibleData,
        createNpcDeps({
          actorNpcRegistry,
          actor: visibleActor,
        })
      );
      const game = createGame({ getVisibleActors: vi.fn(() => [visibleActor]) });
      const knowledge = new NpcWorldKnowledge({
        time: new ManualTime(),
        game,
        actorNpcRegistry,
      });

      expect(knowledge.getVisibleNpcs(npc, 10)).toStrictEqual([visibleNpc]);
      expect(game.getVisibleActors).toHaveBeenCalledExactlyOnceWith(actor, 10);
    });

    it('Бросает ошибку, когда target не в реестре', () => {
      const actorNpcRegistry = new ActorNpcRegistry();
      const data = createNpcData();
      const npc = new Npc(
        data,
        createNpcDeps({
          actorNpcRegistry: createMockedActorNpcRegistry(),
          actor: createActor(),
        })
      );
      const game = createGame();
      const knowledge = new NpcWorldKnowledge({
        time: new ManualTime(),
        game,
        actorNpcRegistry,
      });

      expect(() => knowledge.getVisibleNpcs(npc, 10)).toThrow('NPC не в реестре');
      expect(game.getVisibleActors).not.toHaveBeenCalled();
    });
  });
});
