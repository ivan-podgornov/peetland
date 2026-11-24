import { createControlledObservable } from '@peetland/events/dev';
import { createMockedHTN } from '@peetland/htn/dev';
import { Inventory } from '@peetland/inventory';
import { createActor } from '@peetland/virtual-actor/dev';
import { describe, expect, it } from 'vitest';

import { createNpcData, createNpcDeps } from '../dev';
import { Npc } from '../src';
import type { NpcContext, NpcState } from '../src';

describe('Npc', () => {
  describe('#despawn', () => {
    it('Останавливает HTN-агента', () => {
      const htn = createMockedHTN<NpcState, NpcContext>();
      const data = createNpcData();
      const npc = new Npc(data.id, data.kind, createNpcDeps({ htn }));

      npc.despawn();

      expect(htn.stop).toHaveBeenCalledOnce();
    });

    it('Передаёт HTN-агенту при остановке контекст с актором NPC', () => {
      const actor = createActor();
      const htn = createMockedHTN<NpcState, NpcContext>();
      const data = createNpcData();
      const npc = new Npc(
        data.id,
        data.kind,
        createNpcDeps({
          actor,
          htn,
        })
      );

      npc.despawn();

      expect(htn.stop).toHaveBeenCalledWith(expect.objectContaining({ actor }));
    });

    it('Передаёт HTN-агенту при остановке контекст с инвентарём NPC', () => {
      const htn = createMockedHTN<NpcState, NpcContext>();
      const inventory = new Inventory();
      const data = createNpcData();
      const npc = new Npc(
        data.id,
        data.kind,
        createNpcDeps({
          htn,
          inventory,
        })
      );

      npc.despawn();

      expect(htn.stop).toHaveBeenCalledWith(expect.objectContaining({ inventory }));
    });

    it('Деспавнит актора', () => {
      const actor = createActor();
      const data = createNpcData();
      const npc = new Npc(data.id, data.kind, createNpcDeps({ actor }));

      npc.despawn();

      expect(actor.signal.aborted).toBe(true);
    });

    it('После деспавна тики не вызывают htn.update', () => {
      const ticks = createControlledObservable();
      const htn = createMockedHTN<NpcState, NpcContext>();
      const data = createNpcData();
      const npc = new Npc(
        data.id,
        data.kind,
        createNpcDeps({
          htn,
          ticks: ticks.observable,
        })
      );

      npc.despawn();
      ticks.subscriber.next(undefined);

      expect(htn.update).not.toHaveBeenCalled();
    });
  });
});
