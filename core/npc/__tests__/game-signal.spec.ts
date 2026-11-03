import { AbortController } from '@peetland/events';
import { createMockedHTN, createMockedHTNFactory } from '@peetland/htn/dev';
import { createActor, createMockedActorFactory } from '@peetland/virtual-actor/dev';
import { describe, expect, it } from 'vitest';

import { createNpcData, createNpcDeps } from '../dev';
import { Npc } from '../src';
import type { NpcContext, NpcState } from '../src';

describe('Npc', () => {
  describe('Когда игра завершается', () => {
    it('Деспавнит актора', () => {
      const game = new AbortController();
      const actor = createActor();
      new Npc(
        createNpcData(),
        createNpcDeps({
          actorFactory: createMockedActorFactory(actor),
          signal: game.signal,
        })
      );

      game.abort();

      expect(actor.signal.aborted).toBe(true);
    });

    it('Останавливает HTN-агента', () => {
      const game = new AbortController();
      const htn = createMockedHTN<NpcState, NpcContext>();
      new Npc(
        createNpcData(),
        createNpcDeps({
          htnFactory: createMockedHTNFactory(htn),
          signal: game.signal,
        })
      );

      game.abort();

      expect(htn.stop).toHaveBeenCalledOnce();
    });

    it('Если NPC уже деспавнен, не останавливает HTN-агента повторно', () => {
      const game = new AbortController();
      const htn = createMockedHTN<NpcState, NpcContext>();
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({
          htnFactory: createMockedHTNFactory(htn),
          signal: game.signal,
        })
      );

      npc.despawn();
      game.abort();

      expect(htn.stop).toHaveBeenCalledOnce();
    });
  });

  describe('Если игра уже завершилась', () => {
    it('Сразу деспавнит актора', () => {
      const game = new AbortController();
      const actor = createActor();
      game.abort();

      new Npc(
        createNpcData(),
        createNpcDeps({
          actorFactory: createMockedActorFactory(actor),
          signal: game.signal,
        })
      );

      expect(actor.signal.aborted).toBe(true);
    });

    it('Сразу останавливает HTN-агента', () => {
      const game = new AbortController();
      const htn = createMockedHTN<NpcState, NpcContext>();
      game.abort();

      new Npc(
        createNpcData(),
        createNpcDeps({
          htnFactory: createMockedHTNFactory(htn),
          signal: game.signal,
        })
      );

      expect(htn.stop).toHaveBeenCalledOnce();
    });
  });
});
