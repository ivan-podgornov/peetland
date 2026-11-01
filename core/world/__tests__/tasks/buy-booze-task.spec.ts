import { Geometry } from '@peetland/geometry';
import { Item } from '@peetland/inventory';
import { describe, expect, it } from 'vitest';

import { BOOZE_PRICE, BuyBoozeTask } from '../../src';

import { applyPlanEffects, createNpcState, createPlace, planNames } from './helpers';

describe('BuyBoozeTask', () => {
  it('Планирует дойти до магазина, повернуться к прилавку, заплатить и получить пойло', () => {
    const task = new BuyBoozeTask({ shops: [createPlace()] }, { geometry: new Geometry() });
    const state = createNpcState({ inventory: { [Item.Money]: BOOZE_PRICE } });

    const names = planNames(task, state);

    expect(names).toEqual([
      'go-to-coords',
      'achieve-angle',
      'play-animation',
      'remove-item',
      'add-item',
    ]);
  });

  it('По плану отнимает 100 $ и добавляет бутылку пойла', () => {
    const task = new BuyBoozeTask({ shops: [createPlace()] }, { geometry: new Geometry() });
    const state = createNpcState({ inventory: { [Item.Money]: 150 } });

    const after = applyPlanEffects(task, state);

    expect(after.inventory).toEqual({ [Item.Money]: 50, [Item.Booze]: 1 });
  });

  it('По плану NPC оказывается в ближайшем магазине, повёрнутым к прилавку', () => {
    const shops = [
      createPlace({ id: 'far', position: { x: 100, y: 0, z: 0 }, angle: 10 }),
      createPlace({ id: 'near', position: { x: 10, y: 0, z: 0 }, angle: 90 }),
    ];
    const task = new BuyBoozeTask({ shops }, { geometry: new Geometry() });
    const state = createNpcState({ inventory: { [Item.Money]: BOOZE_PRICE } });

    const after = applyPlanEffects(task, state);

    expect(after.actor).toEqual({ position: { x: 10, y: 0, z: 0 }, angle: 90 });
  });

  it('Если денег меньше 100 $, план не составляется', () => {
    const task = new BuyBoozeTask({ shops: [createPlace()] }, { geometry: new Geometry() });
    const state = createNpcState({ inventory: { [Item.Money]: BOOZE_PRICE - 1 } });

    expect(planNames(task, state)).toBeNull();
  });

  it('Если магазинов нет, план не составляется', () => {
    const task = new BuyBoozeTask({ shops: [] }, { geometry: new Geometry() });
    const state = createNpcState({ inventory: { [Item.Money]: BOOZE_PRICE } });

    expect(planNames(task, state)).toBeNull();
  });
});
