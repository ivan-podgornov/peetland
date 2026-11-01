import { Geometry } from '@peetland/geometry';
import { Item } from '@peetland/inventory';
import { describe, expect, it } from 'vitest';

import { BOOZE_PRICE, RootTask } from '../../src';

import { createNpcState, createPlace, planNames } from './helpers';

/** Задачи плана «бухать» */
const DRINK = ['play-animation', 'remove-item'];

/** Задачи плана «купить пойло» */
const BUY_BOOZE = ['go-to-coords', 'achieve-angle', 'play-animation', 'remove-item', 'add-item'];

/** Создаёт корневую задачу с одним магазином */
function createRootTask(): RootTask {
  return new RootTask({ places: [createPlace()] }, { geometry: new Geometry() });
}

describe('RootTask', () => {
  it('Если есть пойло, планирует бухать', () => {
    const state = createNpcState({ inventory: { [Item.Booze]: 1 } });

    expect(planNames(createRootTask(), state)).toStrictEqual(DRINK);
  });

  it('Если пойла нет, а денег хватает, планирует купить пойло', () => {
    const state = createNpcState({ inventory: { [Item.Money]: BOOZE_PRICE } });

    expect(planNames(createRootTask(), state)).toStrictEqual(BUY_BOOZE);
  });

  it('Если есть и пойло, и деньги, планирует сначала бухать', () => {
    const state = createNpcState({ inventory: { [Item.Booze]: 1, [Item.Money]: BOOZE_PRICE } });

    expect(planNames(createRootTask(), state)).toStrictEqual(DRINK);
  });

  it('Если нет ни пойла, ни денег на него, план не составляется', () => {
    const state = createNpcState({ inventory: { [Item.Money]: BOOZE_PRICE - 1 } });

    expect(planNames(createRootTask(), state)).toBeNull();
  });
});
