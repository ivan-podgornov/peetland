import type { IAbortSignal } from '@peetland/events';
import type { IActor } from '@peetland/game';
import { createActor, createMockedActorFactory } from '@peetland/virtual-actor/dev';
import { describe, expect, it } from 'vitest';

import { createNpcData, createNpcDeps } from '../dev';
import { Npc } from '../src';
import type { IActorNpcRegistry } from '../src';

/** Реестр, который помнит последнюю связь актора с NPC и убирает её, когда сигнал прерван */
function createRememberingRegistry(): IActorNpcRegistry<Npc> {
  let npc: Npc | undefined;
  let actor: IActor | undefined;

  return {
    register(registeredActor, registeredNpc, signal: IAbortSignal): void {
      npc = registeredNpc;
      actor = registeredActor;

      signal.addEventListener(
        'abort',
        () => {
          npc = undefined;
          actor = undefined;
        },
        { once: true }
      );
    },
    getActor(registeredNpc) {
      return registeredNpc === npc ? actor : undefined;
    },
    getNpc(registeredActor) {
      return registeredActor === actor ? npc : undefined;
    },
  };
}

describe('Npc', () => {
  describe('#constructor', () => {
    it('Связывает своего актора с собой в реестре связей', () => {
      const actorNpcRegistry = createRememberingRegistry();
      const actor = createActor();

      const npc = new Npc(
        createNpcData(),
        createNpcDeps({
          actorNpcRegistry,
          actorFactory: createMockedActorFactory(actor),
        })
      );

      expect(actorNpcRegistry.getActor(npc)).toBe(actor);
    });

    it('После деспавна NPC его актора из реестра уже не получить', () => {
      const actorNpcRegistry = createRememberingRegistry();
      const actor = createActor();
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({
          actorNpcRegistry,
          actorFactory: createMockedActorFactory(actor),
        })
      );

      npc.despawn();

      expect(actorNpcRegistry.getActor(npc)).toBeUndefined();
    });
  });
});
