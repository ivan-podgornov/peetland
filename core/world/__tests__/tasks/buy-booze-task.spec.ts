import { Geometry } from '@peetland/geometry';
import { Item } from '@peetland/inventory';
import { createActor } from '@peetland/virtual-actor/dev';
import { describe, expect, it, vi } from 'vitest';

import { BOOZE_PRICE, BuyBoozeTask, PlaceType } from '../../src';

import { createNpcContext, createNpcState, createPlace, plan, planNames } from './helpers';

describe('BuyBoozeTask', () => {
  it('Планирует дойти до магазина, повернуться к прилавку и купить пойло', () => {
    const task = new BuyBoozeTask({ places: [createPlace()] }, { geometry: new Geometry() });
    const state = createNpcState({ inventory: { [Item.Money]: BOOZE_PRICE } });

    const names = planNames(task, state);

    expect(names).toStrictEqual([
      'go-to-coords',
      'achieve-angle',
      'play-animation',
      'remove-item',
      'add-item',
    ]);
  });

  it('Идёт к ближайшему магазину, а не к ближайшему месту другого типа', () => {
    const actor = createActor();
    const goToCoords = vi.spyOn(actor, 'goToCoords');
    const places = [
      createPlace({ id: 'trash', type: PlaceType.TrashBin, position: { x: 1, y: 0, z: 0 } }),
      createPlace({ id: 'far-shop', position: { x: 100, y: 0, z: 0 } }),
      createPlace({ id: 'near-shop', position: { x: 50, y: 0, z: 0 } }),
    ];
    const task = new BuyBoozeTask({ places }, { geometry: new Geometry() });
    const state = createNpcState({ inventory: { [Item.Money]: BOOZE_PRICE } });
    const [goToShop] = plan(task, state) ?? [];

    goToShop?.start(state, createNpcContext(actor));

    expect(goToCoords).toHaveBeenCalledExactlyOnceWith({ x: 50, y: 0, z: 0 }, 0.5);
  });

  it('Выбирает магазин, ближайший к позиции NPC из состояния', () => {
    const actor = createActor();
    const goToCoords = vi.spyOn(actor, 'goToCoords');
    const places = [
      createPlace({ id: 'west', position: { x: -10, y: 0, z: 0 } }),
      createPlace({ id: 'east', position: { x: 10, y: 0, z: 0 } }),
    ];
    const task = new BuyBoozeTask({ places }, { geometry: new Geometry() });
    const state = createNpcState({
      actor: { position: { x: 8, y: 0, z: 0 }, angle: 0 },
      inventory: { [Item.Money]: BOOZE_PRICE },
    });
    const [goToShop] = plan(task, state) ?? [];

    goToShop?.start(state, createNpcContext(actor));

    expect(goToCoords).toHaveBeenCalledExactlyOnceWith({ x: 10, y: 0, z: 0 }, 0.5);
  });

  it('Поворачивается лицом к прилавку ближайшего магазина', () => {
    const actor = createActor();
    const achieveAngle = vi.spyOn(actor, 'achieveAngle');
    const places = [
      createPlace({ id: 'far-shop', position: { x: 100, y: 0, z: 0 }, angle: 10 }),
      createPlace({ id: 'near-shop', position: { x: 50, y: 0, z: 0 }, angle: 90 }),
    ];
    const task = new BuyBoozeTask({ places }, { geometry: new Geometry() });
    const state = createNpcState({ inventory: { [Item.Money]: BOOZE_PRICE } });
    const [, faceCounter] = plan(task, state) ?? [];

    faceCounter?.start(state, createNpcContext(actor));

    expect(achieveAngle).toHaveBeenCalledExactlyOnceWith(90, 15);
  });

  it('Если денег меньше 100 $, план не составляется', () => {
    const task = new BuyBoozeTask({ places: [createPlace()] }, { geometry: new Geometry() });
    const state = createNpcState({ inventory: { [Item.Money]: BOOZE_PRICE - 1 } });

    expect(planNames(task, state)).toBeNull();
  });

  it('Если магазинов нет, план не составляется', () => {
    const places = [createPlace({ type: PlaceType.TrashBin })];
    const task = new BuyBoozeTask({ places }, { geometry: new Geometry() });
    const state = createNpcState({ inventory: { [Item.Money]: BOOZE_PRICE } });

    expect(planNames(task, state)).toBeNull();
  });
});
