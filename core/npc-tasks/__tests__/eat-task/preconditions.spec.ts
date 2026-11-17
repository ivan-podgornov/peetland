import { planSteps } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { createEatTask } from '../../dev';

describe('EatTask', () => {
  describe('Метод eat-food', () => {
    describe('Предусловия', () => {
      it('Если еда есть в инвентаре, план составляется', () => {
        const task = createEatTask({ food: Item.RomashkaLoaf });
        const state = new NpcStateBuilder().withInventory({ [Item.RomashkaLoaf]: 1 }).build();

        expect(planSteps(task, state)).not.toBeNull();
      });

      it('Если еды нет в инвентаре, план не составляется', () => {
        const task = createEatTask({ food: Item.RomashkaLoaf });
        const state = new NpcStateBuilder().withInventory({ [Item.SmilePizza]: 1 }).build();

        expect(planSteps(task, state)).toBeNull();
      });
    });
  });
});
