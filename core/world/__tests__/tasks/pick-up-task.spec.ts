import { Item } from '@peetland/inventory';
import { createActor } from '@peetland/virtual-actor/dev';
import { describe, expect, it, vi } from 'vitest';

import { PickUpTask } from '../../src';

import { applyPlanEffects, createNpcContext, createNpcState, plan, planNames } from './helpers';

describe('PickUpTask', () => {
  it('Планирует проиграть анимацию, а потом добавить предмет', () => {
    const task = new PickUpTask({
      item: Item.Bottles,
      count: 1,
      animation: 'trash-search-pocket',
    });

    const names = planNames(task, createNpcState());

    expect(names).toStrictEqual(['play-animation', 'add-item']);
  });

  it('Берёт предмет с переданной анимацией', () => {
    const actor = createActor();
    const playAnimation = vi.spyOn(actor, 'playAnimation');
    const task = new PickUpTask({
      item: Item.Bottles,
      count: 1,
      animation: 'trash-search-pocket',
    });
    const state = createNpcState();
    const [take] = plan(task, state) ?? [];

    take?.start(state, createNpcContext(actor));

    expect(playAnimation).toHaveBeenCalledExactlyOnceWith('trash-search-pocket', undefined);
  });

  it('По плану добавляет предмет и не трогает деньги', () => {
    const task = new PickUpTask({ item: Item.Bottles, count: 2, animation: 'item-receive' });
    const state = createNpcState({ inventory: { [Item.Money]: 10 } });

    const after = applyPlanEffects(task, state);

    expect(after.inventory).toStrictEqual({ [Item.Money]: 10, [Item.Bottles]: 2 });
  });
});
