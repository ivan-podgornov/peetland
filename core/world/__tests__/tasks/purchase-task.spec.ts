import { Item } from '@peetland/inventory';
import { createActor } from '@peetland/virtual-actor/dev';
import { describe, expect, it, vi } from 'vitest';

import { PurchaseTask } from '../../src';

import { applyPlanEffects, createNpcContext, createNpcState, plan, planNames } from './helpers';

describe('PurchaseTask', () => {
  it('Если денег хватает, планирует заплатить, отнять деньги и добавить предмет', () => {
    const task = new PurchaseTask({ item: Item.Booze, count: 1, price: 100 });
    const state = createNpcState({ inventory: { [Item.Money]: 100 } });

    const names = planNames(task, state);

    expect(names).toStrictEqual(['play-animation', 'remove-item', 'add-item']);
  });

  it('Платит с анимацией оплаты', () => {
    const actor = createActor();
    const playAnimation = vi.spyOn(actor, 'playAnimation');
    const task = new PurchaseTask({ item: Item.Booze, count: 1, price: 100 });
    const state = createNpcState({ inventory: { [Item.Money]: 100 } });
    const [pay] = plan(task, state) ?? [];

    pay?.start(state, createNpcContext(actor));

    expect(playAnimation).toHaveBeenCalledExactlyOnceWith('pay', undefined);
  });

  it('По плану отнимает цену и добавляет предмет', () => {
    const task = new PurchaseTask({ item: Item.Booze, count: 2, price: 100 });
    const state = createNpcState({ inventory: { [Item.Money]: 150 } });

    const after = applyPlanEffects(task, state);

    expect(after.inventory).toStrictEqual({ [Item.Money]: 50, [Item.Booze]: 2 });
  });

  it('Если денег не хватает, план не составляется', () => {
    const task = new PurchaseTask({ item: Item.Booze, count: 1, price: 100 });
    const state = createNpcState({ inventory: { [Item.Money]: 99 } });

    expect(planNames(task, state)).toBeNull();
  });
});
