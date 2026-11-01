import { Item } from '@peetland/inventory';
import { describe, expect, it } from 'vitest';

import { AddItemTask } from '../../src';

import { createNpcContext, createNpcState } from './helpers';

describe('AddItemTask', () => {
  describe('#start', () => {
    it('Добавляет предмет в инвентарь', () => {
      const context = createNpcContext();
      context.inventory.set(Item.Booze, 1);
      const task = new AddItemTask({ item: Item.Booze, count: 2 });

      task.start(createNpcState(), context);

      expect(context.inventory.get(Item.Booze)).toBe(3);
    });

    it("Возвращает 'success'", () => {
      const task = new AddItemTask({ item: Item.Booze, count: 1 });

      const result = task.start(createNpcState(), createNpcContext());

      expect(result).toBe('success');
    });
  });

  describe('#applyEffects', () => {
    it('Увеличивает количество предмета в состоянии', () => {
      const task = new AddItemTask({ item: Item.Booze, count: 1 });

      const state = task.applyEffects(createNpcState({ inventory: { [Item.Booze]: 2 } }));

      expect(state.inventory).toStrictEqual({ [Item.Booze]: 3 });
    });

    it('Если предмета в состоянии не было, добавляет его', () => {
      const task = new AddItemTask({ item: Item.Booze, count: 1 });

      const state = task.applyEffects(createNpcState({ inventory: { [Item.Money]: 5 } }));

      expect(state.inventory).toStrictEqual({ [Item.Money]: 5, [Item.Booze]: 1 });
    });
  });
});
