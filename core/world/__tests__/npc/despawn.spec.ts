import { createControlledObservable } from '@peetland/events/dev';
import { createMockedHTN, createMockedHTNFactory } from '@peetland/htn/dev';
import { createActor, createMockedActorFactory } from '@peetland/virtual-actor/dev';
import { describe, expect, it } from 'vitest';

import { Npc } from '../../src';
import type { NpcState } from '../../src';

import { createNpcData, createNpcDeps } from './helpers';

describe('Npc', () => {
  describe('#despawn', () => {
    it('Останавливает HTN-агента', () => {
      const htn = createMockedHTN<NpcState>();
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({ htnFactory: createMockedHTNFactory(htn) })
      );

      npc.despawn();

      expect(htn.stop).toHaveBeenCalledOnce();
    });

    it('Деспавнит актора', () => {
      const actor = createActor();
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({ actorFactory: createMockedActorFactory(actor) })
      );

      npc.despawn();

      expect(actor.signal.aborted).toBe(true);
    });

    it('После деспавна кадры не вызывают htn.update', () => {
      const frames = createControlledObservable();
      const htn = createMockedHTN<NpcState>();
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({ htnFactory: createMockedHTNFactory(htn), frames: frames.observable })
      );

      npc.despawn();
      frames.subscriber.next(undefined);

      expect(htn.update).not.toHaveBeenCalled();
    });
  });
});
