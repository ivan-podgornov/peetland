import { createControlledObservable } from '@peetland/events/dev';
import { createMockedHTN } from '@peetland/htn/dev';
import { Inventory, Item } from '@peetland/inventory';
import { createMockedPsyche } from '@peetland/psyche/dev';
import { createActor } from '@peetland/virtual-actor/dev';
import { describe, expect, it, vi } from 'vitest';

import { createNpcData, createNpcDeps } from '../dev';
import { Npc } from '../src';
import type { NpcContext, NpcState } from '../src';

describe('Npc', () => {
  describe('Каждый тик', () => {
    it('Не обновляет HTN-агента, пока не наступил тик', () => {
      const htn = createMockedHTN<NpcState, NpcContext>();
      new Npc(createNpcData(), createNpcDeps({ htn }));

      expect(htn.update).not.toHaveBeenCalled();
    });

    it('Вызывает htn.update с состоянием NPC', () => {
      const ticks = createControlledObservable();
      const htn = createMockedHTN<NpcState, NpcContext>();
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({
          htn,
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
          actor,
          htn,
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
      const inventory = new Inventory();
      new Npc(
        createNpcData(),
        createNpcDeps({
          htn,
          inventory,
          ticks: ticks.observable,
        })
      );

      ticks.subscriber.next(undefined);

      expect(htn.update).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ inventory })
      );
    });

    it('Вызывает htn.update с контекстом, в котором психика NPC', () => {
      const ticks = createControlledObservable();
      const htn = createMockedHTN<NpcState, NpcContext>();
      const psyche = createMockedPsyche();
      new Npc(
        createNpcData(),
        createNpcDeps({
          htn,
          psyche,
          ticks: ticks.observable,
        })
      );

      ticks.subscriber.next(undefined);

      expect(htn.update).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ psyche })
      );
    });

    it('Вызывает htn.update на каждый тик', () => {
      const ticks = createControlledObservable();
      const htn = createMockedHTN<NpcState, NpcContext>();
      new Npc(
        createNpcData(),
        createNpcDeps({
          htn,
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
          htn,
          ticks: ticks.observable,
        })
      );

      ticks.subscriber.next(undefined);

      expect(npc.getState().self.inventory.get(Item.Booze)).toBe(1);
    });
  });
});
