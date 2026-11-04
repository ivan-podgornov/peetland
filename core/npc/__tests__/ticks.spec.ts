import { createControlledObservable } from '@peetland/events/dev';
import { createMockedHTN, createMockedHTNFactory } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { createActor, createMockedActorFactory } from '@peetland/virtual-actor/dev';
import { describe, expect, it, vi } from 'vitest';

import { createNpcData, createNpcDeps } from '../dev';
import { Npc } from '../src';
import type { NpcContext, NpcState } from '../src';

describe('Npc', () => {
  describe('Каждый тик', () => {
    it('Вызывает htn.update с состоянием NPC', () => {
      const ticks = createControlledObservable();
      const htn = createMockedHTN<NpcState, NpcContext>();
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({
          htnFactory: createMockedHTNFactory(htn),
          ticks: ticks.observable,
        })
      );

      ticks.subscriber.next(undefined);

      expect(htn.update).toHaveBeenCalledExactlyOnceWith(npc.getState(), expect.anything());
    });

    it('Вызывает htn.update с контекстом, в котором актор NPC', () => {
      const ticks = createControlledObservable();
      const actor = createActor();
      const htn = createMockedHTN<NpcState, NpcContext>();
      new Npc(
        createNpcData(),
        createNpcDeps({
          actorFactory: createMockedActorFactory(actor),
          htnFactory: createMockedHTNFactory(htn),
          ticks: ticks.observable,
        })
      );

      ticks.subscriber.next(undefined);

      expect(htn.update).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ actor })
      );
    });

    it('Вызывает htn.update с контекстом, в котором инвентарь NPC', () => {
      const ticks = createControlledObservable();
      const htn = createMockedHTN<NpcState, NpcContext>();
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({
          htnFactory: createMockedHTNFactory(htn),
          ticks: ticks.observable,
        })
      );

      ticks.subscriber.next(undefined);

      expect(htn.update).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ inventory: npc.inventory })
      );
    });

    it('Вызывает htn.update с контекстом, в котором психика NPC', () => {
      const ticks = createControlledObservable();
      const htn = createMockedHTN<NpcState, NpcContext>();
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({
          htnFactory: createMockedHTNFactory(htn),
          ticks: ticks.observable,
        })
      );

      ticks.subscriber.next(undefined);

      expect(htn.update).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ psyche: npc.psyche })
      );
    });

    it('Вызывает htn.update на каждый тик', () => {
      const ticks = createControlledObservable();
      const htn = createMockedHTN<NpcState, NpcContext>();
      new Npc(
        createNpcData(),
        createNpcDeps({
          htnFactory: createMockedHTNFactory(htn),
          ticks: ticks.observable,
        })
      );

      ticks.subscriber.next(undefined);
      ticks.subscriber.next(undefined);

      expect(htn.update).toHaveBeenCalledTimes(2);
    });

    it('Если задача поменяла инвентарь из контекста, меняется инвентарь NPC', () => {
      const ticks = createControlledObservable();
      const htn = createMockedHTN<NpcState, NpcContext>();
      vi.mocked(htn.update).mockImplementation((_state: NpcState, context: NpcContext) => {
        context.inventory.add(Item.Booze, 1);
      });
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({
          htnFactory: createMockedHTNFactory(htn),
          ticks: ticks.observable,
        })
      );

      ticks.subscriber.next(undefined);

      expect(npc.inventory.get(Item.Booze)).toBe(1);
    });
  });
});
