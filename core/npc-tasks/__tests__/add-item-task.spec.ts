import { Item } from '@peetland/inventory';
import { createNpcContext, createNpcState } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { AddItemTask } from '../src/add-item-task';

describe('AddItemTask', () => {
  describe('#start', () => {
    it('Добавляет предмет в инвентарь', () => {
      const context = createNpcContext();
      context.inventory.set(Item.Booze, 1);
      const task = new AddItemTask({
        item: Item.Booze,
        count: 2,
      });

      task.start(createNpcState(), context);

      expect(context.inventory.get(Item.Booze)).toBe(3);
    });

    it("Возвращает 'success'", () => {
      const task = new AddItemTask({
        item: Item.Booze,
        count: 1,
      });

      const result = task.start(createNpcState(), createNpcContext());

      expect(result).toBe('success');
    });
  });

  describe('#applyEffects', () => {
    it('Не меняет то, что NPC знает о мире', () => {
      const task = new AddItemTask({
        item: Item.Booze,
        count: 1,
      });

      const state = task.applyEffects(
        createNpcState({
          world: {
            time: {
              day: 1,
              hours: 20,
              minutes: 0,
            },
          },
        })
      );

      expect(state.world).toStrictEqual({
        time: {
          day: 1,
          hours: 20,
          minutes: 0,
        },
      });
    });

    it('Увеличивает количество предмета в состоянии', () => {
      const task = new AddItemTask({
        item: Item.Booze,
        count: 1,
      });

      const state = task.applyEffects(createNpcState({ self: { inventory: { [Item.Booze]: 2 } } }));

      expect(state.self.inventory).toStrictEqual({ [Item.Booze]: 3 });
    });

    it('Если предмета в состоянии не было, добавляет его', () => {
      const task = new AddItemTask({
        item: Item.Booze,
        count: 1,
      });

      const state = task.applyEffects(createNpcState({ self: { inventory: { [Item.Money]: 5 } } }));

      expect(state.self.inventory).toStrictEqual({
        [Item.Money]: 5,
        [Item.Booze]: 1,
      });
    });
  });
});
