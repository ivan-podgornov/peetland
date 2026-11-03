import { applyPlanEffects, planNames } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { createNpcState } from '@peetland/npc/dev';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { describe, expect, it, vi } from 'vitest';

import { PurchaseTask } from '../src/purchase-task';

describe('PurchaseTask', () => {
  it('Если денег хватает, планирует заплатить, отнять деньги и добавить предмет', () => {
    const task = new PurchaseTask(
      {
        item: Item.Booze,
        count: 1,
        price: 100,
      },
      { npcTaskFactory: createNpcTaskFactory() }
    );
    const state = createNpcState({ self: { inventory: { [Item.Money]: 100 } } });

    const names = planNames(task, state);

    expect(names).toStrictEqual(['play-animation', 'remove-item', 'add-item']);
  });

  it('Платит с анимацией оплаты', () => {
    const playAnimation = vi.fn();

    new PurchaseTask(
      {
        item: Item.Booze,
        count: 1,
        price: 100,
      },
      { npcTaskFactory: createNpcTaskFactory({ playAnimation }) }
    );

    expect(playAnimation).toHaveBeenCalledExactlyOnceWith({ animation: 'pay' });
  });

  it('По плану отнимает цену и добавляет предмет', () => {
    const task = new PurchaseTask(
      {
        item: Item.Booze,
        count: 2,
        price: 100,
      },
      { npcTaskFactory: createNpcTaskFactory() }
    );
    const state = createNpcState({ self: { inventory: { [Item.Money]: 150 } } });

    const after = applyPlanEffects(task, state);

    expect(after.self.inventory).toStrictEqual({
      [Item.Money]: 50,
      [Item.Booze]: 2,
    });
  });

  it('Если денег не хватает, план не составляется', () => {
    const task = new PurchaseTask(
      {
        item: Item.Booze,
        count: 1,
        price: 100,
      },
      { npcTaskFactory: createNpcTaskFactory() }
    );
    const state = createNpcState({ self: { inventory: { [Item.Money]: 99 } } });

    expect(planNames(task, state)).toBeNull();
  });
});
