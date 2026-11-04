import { createControlledObservable } from '@peetland/events/dev';
import { createMockedHTN, createMockedHTNFactory } from '@peetland/htn/dev';
import { createActor, createMockedActorFactory } from '@peetland/virtual-actor/dev';
import { describe, expect, it } from 'vitest';

import { createNpcData, createNpcDeps } from '../dev';
import { Npc } from '../src';
import type { NpcContext, NpcState } from '../src';

describe('Npc', () => {
  describe('#despawn', () => {
    it('Останавливает HTN-агента', () => {
      const htn = createMockedHTN<NpcState, NpcContext>();
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({ htnFactory: createMockedHTNFactory(htn) })
      );

      npc.despawn();

      expect(htn.stop).toHaveBeenCalledOnce();
    });

    it('Передаёт HTN-агенту при остановке контекст с актором NPC', () => {
      const actor = createActor();
      const htn = createMockedHTN<NpcState, NpcContext>();
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({
          actorFactory: createMockedActorFactory(actor),
          htnFactory: createMockedHTNFactory(htn),
        })
      );

      npc.despawn();

      expect(htn.stop).toHaveBeenCalledWith(expect.objectContaining({ actor }));
    });

    it('Передаёт HTN-агенту при остановке контекст с инвентарём NPC', () => {
      const htn = createMockedHTN<NpcState, NpcContext>();
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({ htnFactory: createMockedHTNFactory(htn) })
      );

      npc.despawn();

      expect(htn.stop).toHaveBeenCalledWith(expect.objectContaining({ inventory: npc.inventory }));
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

    it('После деспавна тики не вызывают htn.update', () => {
      const ticks = createControlledObservable();
      const htn = createMockedHTN<NpcState, NpcContext>();
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({
          htnFactory: createMockedHTNFactory(htn),
          ticks: ticks.observable,
        })
      );

      npc.despawn();
      ticks.subscriber.next(undefined);

      expect(htn.update).not.toHaveBeenCalled();
    });
  });
});
