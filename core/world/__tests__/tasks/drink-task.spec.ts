import { Item } from '@peetland/inventory';
import { describe, expect, it } from 'vitest';

import { DrinkTask } from '../../src';

import { applyPlanEffects, createNpcState, planNames } from './helpers';

describe('DrinkTask', () => {
  it('Если есть пойло, планирует проиграть анимацию питья, а потом отнять пойло', () => {
    const state = createNpcState({ inventory: { [Item.Booze]: 1 } });

    const names = planNames(new DrinkTask(), state);

    expect(names).toStrictEqual(['play-animation', 'remove-item']);
  });

  it('По плану отнимает одну бутылку пойла', () => {
    const state = createNpcState({ inventory: { [Item.Booze]: 3 } });

    const after = applyPlanEffects(new DrinkTask(), state);

    expect(after.inventory).toStrictEqual({ [Item.Booze]: 2 });
  });

  it('Если пойла нет, план не составляется', () => {
    const names = planNames(new DrinkTask(), createNpcState({ inventory: {} }));

    expect(names).toBeNull();
  });
});
