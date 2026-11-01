import { Geometry } from '@peetland/geometry';
import { Item } from '@peetland/inventory';
import { describe, expect, it } from 'vitest';

import { BOOZE_PRICE, RootTask } from '../../src';

import { applyPlanEffects, createNpcState, createPlace, planNames } from './helpers';

/** Создаёт корневую задачу с одним магазином */
function createRootTask(): RootTask {
  return new RootTask({ shops: [createPlace()] }, { geometry: new Geometry() });
}

describe('RootTask', () => {
  it('Если есть пойло, планирует бухать', () => {
    const state = createNpcState({ inventory: { [Item.Booze]: 1 } });

    const after = applyPlanEffects(createRootTask(), state);

    expect(after.inventory).toEqual({});
  });

  it('Если пойла нет, а денег хватает, планирует купить пойло', () => {
    const state = createNpcState({ inventory: { [Item.Money]: BOOZE_PRICE } });

    const after = applyPlanEffects(createRootTask(), state);

    expect(after.inventory).toEqual({ [Item.Booze]: 1 });
  });

  it('Если есть и пойло, и деньги, планирует сначала бухать', () => {
    const state = createNpcState({ inventory: { [Item.Booze]: 1, [Item.Money]: BOOZE_PRICE } });

    const after = applyPlanEffects(createRootTask(), state);

    expect(after.inventory).toEqual({ [Item.Money]: BOOZE_PRICE });
  });

  it('Если нет ни пойла, ни денег на него, план не составляется', () => {
    const state = createNpcState({ inventory: { [Item.Money]: BOOZE_PRICE - 1 } });

    expect(planNames(createRootTask(), state)).toBeNull();
  });
});
