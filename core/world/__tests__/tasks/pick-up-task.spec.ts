import { Item } from '@peetland/inventory';
import { describe, expect, it, vi } from 'vitest';

import { PickUpTask } from '../../src';

import { applyPlanEffects, createNpcState, createTaskFactory, planNames } from './helpers';

describe('PickUpTask', () => {
  it('Планирует проиграть анимацию, а потом добавить предмет', () => {
    const task = new PickUpTask(
      { item: Item.Bottles, count: 1 },
      { taskFactory: createTaskFactory() }
    );

    const names = planNames(task, createNpcState());

    expect(names).toStrictEqual(['play-animation', 'add-item']);
  });

  it('Берёт предмет с анимацией получения предмета', () => {
    const taskFactory = createTaskFactory();
    const playAnimation = vi.spyOn(taskFactory, 'playAnimation');

    new PickUpTask({ item: Item.Bottles, count: 1 }, { taskFactory });

    expect(playAnimation).toHaveBeenCalledExactlyOnceWith({ animation: 'item-receive' });
  });

  it('По плану добавляет предмет и не трогает деньги', () => {
    const task = new PickUpTask(
      { item: Item.Bottles, count: 2 },
      { taskFactory: createTaskFactory() }
    );
    const state = createNpcState({ inventory: { [Item.Money]: 10 } });

    const after = applyPlanEffects(task, state);

    expect(after.inventory).toStrictEqual({ [Item.Money]: 10, [Item.Bottles]: 2 });
  });
});
