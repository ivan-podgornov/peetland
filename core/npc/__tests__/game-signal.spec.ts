import { AbortController } from '@peetland/events';
import { createMockedHTN } from '@peetland/htn/dev';
import { createActor } from '@peetland/virtual-actor/dev';
import { describe, expect, it } from 'vitest';

import { createNpcData, createNpcDeps } from '../dev';
import { Npc } from '../src';
import type { NpcContext, NpcState } from '../src';

describe('Npc', () => {
  describe('Когда игра завершается', () => {
    it('Деспавнит актора', () => {
      const game = new AbortController();
      const actor = createActor();
      const data = createNpcData();
      new Npc(
        data,
        createNpcDeps({
          actor,
          gameSignal: game.signal,
        })
      );

      game.abort();

      expect(actor.signal.aborted).toBe(true);
    });

    it('Останавливает HTN-агента', () => {
      const game = new AbortController();
      const htn = createMockedHTN<NpcState, NpcContext>();
      const data = createNpcData();
      new Npc(
        data,
        createNpcDeps({
          htn,
          gameSignal: game.signal,
        })
      );

      game.abort();

      expect(htn.stop).toHaveBeenCalledOnce();
    });

    it('Если NPC уже деспавнен, не останавливает HTN-агента повторно', () => {
      const game = new AbortController();
      const htn = createMockedHTN<NpcState, NpcContext>();
      const data = createNpcData();
      const npc = new Npc(
        data,
        createNpcDeps({
          htn,
          gameSignal: game.signal,
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
      const data = createNpcData();

      new Npc(
        data,
        createNpcDeps({
          actor,
          gameSignal: game.signal,
        })
      );

      expect(actor.signal.aborted).toBe(true);
    });

    it('Сразу останавливает HTN-агента', () => {
      const game = new AbortController();
      const htn = createMockedHTN<NpcState, NpcContext>();
      game.abort();
      const data = createNpcData();

      new Npc(
        data,
        createNpcDeps({
          htn,
          gameSignal: game.signal,
        })
      );

      expect(htn.stop).toHaveBeenCalledOnce();
    });
  });
});
