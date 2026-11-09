import { Item } from '@peetland/inventory';
import { createNpcContext, NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { RemoveItemTask } from '../src/remove-item-task';

describe('RemoveItemTask', () => {
  describe('#canExecute', () => {
    it('Если предмета в состоянии хватает, возвращает true', () => {
      const task = new RemoveItemTask({
        item: Item.Money,
        count: 100,
      });

      expect(
        task.canExecute(new NpcStateBuilder().withInventory({ [Item.Money]: 100 }).build())
      ).toBe(true);
    });

    it('Если предмета в состоянии не хватает, возвращает false', () => {
      const task = new RemoveItemTask({
        item: Item.Money,
        count: 100,
      });

      expect(
        task.canExecute(new NpcStateBuilder().withInventory({ [Item.Money]: 99 }).build())
      ).toBe(false);
    });
  });

  describe('#start', () => {
    it('Отнимает предмет из инвентаря', () => {
      const context = createNpcContext();
      context.inventory.set(Item.Money, 150);
      const task = new RemoveItemTask({
        item: Item.Money,
        count: 100,
      });

      task.start(NpcStateBuilder.default(), context);

      expect(context.inventory.get(Item.Money)).toBe(50);
    });

    it("Если предмета хватило, возвращает 'success'", () => {
      const context = createNpcContext();
      context.inventory.set(Item.Money, 100);
      const task = new RemoveItemTask({
        item: Item.Money,
        count: 100,
      });

      const result = task.start(NpcStateBuilder.default(), context);

      expect(result).toBe('success');
    });

    it("Если предмета не хватило, возвращает 'failed'", () => {
      const context = createNpcContext();
      context.inventory.set(Item.Money, 99);
      const task = new RemoveItemTask({
        item: Item.Money,
        count: 100,
      });

      const result = task.start(NpcStateBuilder.default(), context);

      expect(result).toBe('failed');
    });
  });

  describe('#applyEffects', () => {
    it('Не меняет то, что NPC знает о мире', () => {
      const task = new RemoveItemTask({
        item: Item.Booze,
        count: 1,
      });

      const state = task.applyEffects(
        new NpcStateBuilder()
          .withInventory({ [Item.Booze]: 1 })
          .withTime({
            day: 1,
            hours: 20,
            minutes: 0,
          })
          .build()
      );

      expect(state.world).toStrictEqual({
        time: {
          day: 1,
          hours: 20,
          minutes: 0,
        },
      });
    });

    it('Уменьшает количество предмета в состоянии', () => {
      const task = new RemoveItemTask({
        item: Item.Money,
        count: 100,
      });

      const state = task.applyEffects(
        new NpcStateBuilder().withInventory({ [Item.Money]: 150 }).build()
      );

      expect(state.self.inventory.getAll()).toStrictEqual({ [Item.Money]: 50 });
    });

    it('Если предмета не осталось, убирает его из состояния', () => {
      const task = new RemoveItemTask({
        item: Item.Booze,
        count: 1,
      });

      const state = task.applyEffects(
        new NpcStateBuilder().withInventory({ [Item.Booze]: 1 }).build()
      );

      expect(state.self.inventory.getAll()).toStrictEqual({});
    });

    it('Не меняет инвентарь исходного состояния', () => {
      const task = new RemoveItemTask({
        item: Item.Booze,
        count: 1,
      });
      const state = new NpcStateBuilder().withInventory({ [Item.Booze]: 2 }).build();

      task.applyEffects(state);

      expect(state.self.inventory.get(Item.Booze)).toBe(2);
    });
  });
});
