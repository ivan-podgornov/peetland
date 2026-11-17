import { applyPlanEffects, planSteps, PlanStructureBuilder, planTree } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import type { Food } from '@peetland/inventory';
import { Activity, Need } from '@peetland/needs';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it, vi } from 'vitest';

import { createEatTask, createNpcTaskFactory } from '../../dev';

describe('EatTask', () => {
  describe('Метод eat-food', () => {
    describe('Задачи', () => {
      it('Планирует проиграть анимацию, отнять еду и сообщить потребностям одной транзакцией: если NPC начал есть, он доест', () => {
        const task = createEatTask({ food: Item.SmilePizza });
        const state = new NpcStateBuilder().withInventory({ [Item.SmilePizza]: 1 }).build();

        expect(planTree(planSteps(task, state) ?? [])).toStrictEqual(
          new PlanStructureBuilder()
            .transaction('eat', 'eat-food', (eat) =>
              eat.primitive('play-animation').primitive('remove-item').primitive('needs-perform')
            )
            .build()
        );
      });

      it.each<Food>([Item.RomashkaLoaf, Item.SmilePizza])('Ест %s анимацией eat-pizza', (food) => {
        const playAnimation = vi.fn();

        createEatTask({ food }, createNpcTaskFactory({ playAnimation }));

        expect(playAnimation).toHaveBeenCalledExactlyOnceWith({ animation: 'eat-pizza' });
      });

      it('Отнимает одну штуку еды', () => {
        const removeItem = vi.fn();

        createEatTask({ food: Item.RomashkaLoaf }, createNpcTaskFactory({ removeItem }));

        expect(removeItem).toHaveBeenCalledExactlyOnceWith({
          item: Item.RomashkaLoaf,
          count: 1,
        });
      });

      it('Сообщает потребностям, что NPC поел эту еду', () => {
        const needsPerform = vi.fn();

        createEatTask({ food: Item.RomashkaLoaf }, createNpcTaskFactory({ needsPerform }));

        expect(needsPerform).toHaveBeenCalledExactlyOnceWith({
          activity: Activity.Eat,
          details: { food: Item.RomashkaLoaf },
        });
      });

      it('По плану еда пропадает из инвентаря, а сытость растёт', () => {
        const task = createEatTask({ food: Item.SmilePizza });
        const state = new NpcStateBuilder()
          .withInventory({ [Item.SmilePizza]: 1 })
          .withNeeds({ [Need.Satiety]: 0 })
          .build();

        const after = applyPlanEffects(task, state);

        expect(after.self.inventory.has(Item.SmilePizza)).toBe(false);
        expect(after.self.needs.get(Need.Satiety, after.world.time)).toBeGreaterThan(0);
      });
    });
  });
});
