import { createControlledObservable } from '@peetland/events/dev';
import { createMockedHTN, createMockedHTNFactory } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { describe, expect, it, vi } from 'vitest';

import { Npc } from '../../src';
import type { NpcState } from '../../src';

import { createNpcData, createNpcDeps } from './helpers';

describe('Npc', () => {
  describe('Каждый кадр', () => {
    it('Вызывает htn.update с состоянием NPC', () => {
      const frames = createControlledObservable();
      const htn = createMockedHTN<NpcState>();
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({ htnFactory: createMockedHTNFactory(htn), frames: frames.observable })
      );

      frames.subscriber.next(undefined);

      expect(htn.update).toHaveBeenCalledExactlyOnceWith(npc.getState());
    });

    it('Вызывает htn.update на каждый кадр', () => {
      const frames = createControlledObservable();
      const htn = createMockedHTN<NpcState>();
      new Npc(
        createNpcData(),
        createNpcDeps({ htnFactory: createMockedHTNFactory(htn), frames: frames.observable })
      );

      frames.subscriber.next(undefined);
      frames.subscriber.next(undefined);

      expect(htn.update).toHaveBeenCalledTimes(2);
    });

    it('Если задача поменяла инвентарь из состояния, меняется инвентарь NPC', () => {
      const frames = createControlledObservable();
      const htn = createMockedHTN<NpcState>();
      vi.mocked(htn.update).mockImplementation((state: NpcState) => {
        state.inventory.add(Item.Booze, 1);
      });
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({ htnFactory: createMockedHTNFactory(htn), frames: frames.observable })
      );

      frames.subscriber.next(undefined);

      expect(npc.inventory.get(Item.Booze)).toBe(1);
    });
  });
});
