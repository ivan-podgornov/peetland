import { Npc } from '@peetland/npc';
import type { IActorNpcRegistry, INpc } from '@peetland/npc';
import { createMockedActorNpcRegistry, createNpcData, createNpcDeps } from '@peetland/npc/dev';
import { ManualTime } from '@peetland/timings';
import { createActor } from '@peetland/virtual-actor/dev';
import { describe, expect, it, vi } from 'vitest';

import { createGame } from '../dev';
import { ActorNpcRegistry } from '../src/actor-npc-registry';
import { NpcWorldKnowledge } from '../src/npc-world-knowledge';

/** Создаёт NPC, который живёт в переданном реестре связей */
function createRegisteredNpc(actorNpcRegistry: IActorNpcRegistry, actor = createActor()): INpc {
  return new Npc(
    createNpcData(),
    createNpcDeps({
      actorNpcRegistry,
      actor,
    })
  );
}

describe('NpcWorldKnowledge', () => {
  describe('#getState', () => {
    it('Возвращает время суток', () => {
      const actorNpcRegistry = new ActorNpcRegistry();
      const time = new ManualTime();
      const knowledge = new NpcWorldKnowledge({
        time,
        game: createGame(),
        actorNpcRegistry,
      });
      const npc = createRegisteredNpc(actorNpcRegistry);

      expect(knowledge.getState(npc).time).toBe(time);
    });

    it('Собирает видимость глазами того NPC, для которого собрано состояние', () => {
      const actorNpcRegistry = new ActorNpcRegistry();
      const actor = createActor();
      const npc = createRegisteredNpc(actorNpcRegistry, actor);
      const otherActor = createActor();
      const otherNpc = createRegisteredNpc(actorNpcRegistry, otherActor);
      const visibleActor = createActor();
      const visibleNpc = createRegisteredNpc(actorNpcRegistry, visibleActor);
      const game = createGame({
        getVisibleActors: vi.fn((target) => (target === actor ? [visibleActor] : [])),
      });
      const knowledge = new NpcWorldKnowledge({
        time: new ManualTime(),
        game,
        actorNpcRegistry,
      });

      const npcState = knowledge.getState(npc);
      const otherNpcState = knowledge.getState(otherNpc);

      expect(npcState.getVisibleNpcs(10)).toStrictEqual([visibleNpc]);
      expect(otherNpcState.getVisibleNpcs(10)).toStrictEqual([]);
      expect(game.getVisibleActors).toHaveBeenCalledWith(actor, 10);
      expect(game.getVisibleActors).toHaveBeenCalledWith(otherActor, 10);
    });
  });

  describe('#getVisibleNpcs', () => {
    it('Возвращает NPC, которых видит target в радиусе radius', () => {
      const actorNpcRegistry = new ActorNpcRegistry();
      const actor = createActor();
      const npc = createRegisteredNpc(actorNpcRegistry, actor);
      const visibleActor = createActor();
      const visibleNpc = createRegisteredNpc(actorNpcRegistry, visibleActor);
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
      const npc = new Npc(
        createNpcData(),
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
