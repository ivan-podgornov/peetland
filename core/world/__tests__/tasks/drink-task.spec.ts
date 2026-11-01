import { Item } from '@peetland/inventory';
import { describe, expect, it, vi } from 'vitest';

import { DRINK_DURATION, DrinkTask } from '../../src';

import { applyPlanEffects, createNpcState, createTaskFactory, planNames } from './helpers';

describe('DrinkTask', () => {
  it('Если есть пойло, планирует проиграть анимацию питья, отнять пойло и добавить пустую бутылку', () => {
    const task = new DrinkTask({ taskFactory: createTaskFactory() });
    const state = createNpcState({ inventory: { [Item.Booze]: 1 } });

    const names = planNames(task, state);

    expect(names).toStrictEqual(['play-animation', 'remove-item', 'add-item']);
  });

  it('Пьёт стоя в течение DRINK_DURATION', () => {
    const playAnimation = vi.fn();

    new DrinkTask({ taskFactory: createTaskFactory({ playAnimation }) });

    expect(playAnimation).toHaveBeenCalledExactlyOnceWith({
      animation: 'drink-standing-1',
      duration: DRINK_DURATION,
    });
  });

  it('По плану отнимает бутылку пойла и добавляет пустую бутылку', () => {
    const task = new DrinkTask({ taskFactory: createTaskFactory() });
    const state = createNpcState({ inventory: { [Item.Booze]: 3 } });

    const after = applyPlanEffects(task, state);

    expect(after.inventory).toStrictEqual({ [Item.Booze]: 2, [Item.Bottles]: 1 });
  });

  it('Если пойла нет, план не составляется', () => {
    const task = new DrinkTask({ taskFactory: createTaskFactory() });

    expect(planNames(task, createNpcState({ inventory: {} }))).toBeNull();
  });
});
