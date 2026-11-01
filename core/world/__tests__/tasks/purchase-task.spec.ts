import { Item } from '@peetland/inventory';
import { describe, expect, it, vi } from 'vitest';

import { PurchaseTask } from '../../src';

import { applyPlanEffects, createNpcState, createTaskFactory, planNames } from './helpers';

describe('PurchaseTask', () => {
  it('Если денег хватает, планирует заплатить, отнять деньги и добавить предмет', () => {
    const task = new PurchaseTask(
      { item: Item.Booze, count: 1, price: 100 },
      { taskFactory: createTaskFactory() }
    );
    const state = createNpcState({ inventory: { [Item.Money]: 100 } });

    const names = planNames(task, state);

    expect(names).toStrictEqual(['play-animation', 'remove-item', 'add-item']);
  });

  it('Платит с анимацией оплаты', () => {
    const taskFactory = createTaskFactory();
    const playAnimation = vi.spyOn(taskFactory, 'playAnimation');

    new PurchaseTask({ item: Item.Booze, count: 1, price: 100 }, { taskFactory });

    expect(playAnimation).toHaveBeenCalledExactlyOnceWith({ animation: 'pay' });
  });

  it('По плану отнимает цену и добавляет предмет', () => {
    const task = new PurchaseTask(
      { item: Item.Booze, count: 2, price: 100 },
      { taskFactory: createTaskFactory() }
    );
    const state = createNpcState({ inventory: { [Item.Money]: 150 } });

    const after = applyPlanEffects(task, state);

    expect(after.inventory).toStrictEqual({ [Item.Money]: 50, [Item.Booze]: 2 });
  });

  it('Если денег не хватает, план не составляется', () => {
    const task = new PurchaseTask(
      { item: Item.Booze, count: 1, price: 100 },
      { taskFactory: createTaskFactory() }
    );
    const state = createNpcState({ inventory: { [Item.Money]: 99 } });

    expect(planNames(task, state)).toBeNull();
  });
});
