import { Item } from '@peetland/inventory';
import { describe, expect, it } from 'vitest';

import { RemoveItemTask } from '../../src';

import { createNpcContext, createNpcState } from './helpers';

describe('RemoveItemTask', () => {
  describe('#canExecute', () => {
    it('Если предмета в состоянии хватает, возвращает true', () => {
      const task = new RemoveItemTask({ item: Item.Money, count: 100 });

      expect(task.canExecute(createNpcState({ inventory: { [Item.Money]: 100 } }))).toBe(true);
    });

    it('Если предмета в состоянии не хватает, возвращает false', () => {
      const task = new RemoveItemTask({ item: Item.Money, count: 100 });

      expect(task.canExecute(createNpcState({ inventory: { [Item.Money]: 99 } }))).toBe(false);
    });
  });

  describe('#start', () => {
    it('Отнимает предмет из инвентаря', () => {
      const context = createNpcContext();
      context.inventory.set(Item.Money, 150);
      const task = new RemoveItemTask({ item: Item.Money, count: 100 });

      task.start(createNpcState(), context);

      expect(context.inventory.get(Item.Money)).toBe(50);
    });

    it("Если предмета хватило, возвращает 'success'", () => {
      const context = createNpcContext();
      context.inventory.set(Item.Money, 100);
      const task = new RemoveItemTask({ item: Item.Money, count: 100 });

      const result = task.start(createNpcState(), context);

      expect(result).toBe('success');
    });

    it("Если предмета не хватило, возвращает 'failed'", () => {
      const context = createNpcContext();
      context.inventory.set(Item.Money, 99);
      const task = new RemoveItemTask({ item: Item.Money, count: 100 });

      const result = task.start(createNpcState(), context);

      expect(result).toBe('failed');
    });
  });

  describe('#applyEffects', () => {
    it('Уменьшает количество предмета в состоянии', () => {
      const task = new RemoveItemTask({ item: Item.Money, count: 100 });

      const state = task.applyEffects(createNpcState({ inventory: { [Item.Money]: 150 } }));

      expect(state.inventory).toStrictEqual({ [Item.Money]: 50 });
    });

    it('Если предмета не осталось, убирает его из состояния', () => {
      const task = new RemoveItemTask({ item: Item.Booze, count: 1 });

      const state = task.applyEffects(createNpcState({ inventory: { [Item.Booze]: 1 } }));

      expect(state.inventory).toStrictEqual({});
    });
  });
});
