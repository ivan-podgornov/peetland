import { plan, planNames } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { describe, expect, it, vi } from 'vitest';

import { createSellBottlesTask, createPlacesWithCollection, BOTTLES_FOR_BOOZE } from '../../dev';
import { BOOZE_PRICE } from '../../src/buy-booze-task';
import { BOTTLE_PRICE } from '../../src/sell-bottles-task';

describe('SellBottlesTask', () => {
  it('Отдаёт бутылки с анимацией item-give', () => {
    const playAnimation = vi.fn();
    const task = createSellBottlesTask(
      createPlacesWithCollection(),
      createNpcTaskFactory({ playAnimation })
    );

    plan(task, new NpcStateBuilder().withInventory({ [Item.Bottles]: BOTTLES_FOR_BOOZE }).build());

    expect(playAnimation).toHaveBeenCalledExactlyOnceWith({ animation: 'item-give' });
  });

  it('Отдаёт все бутылки из состояния', () => {
    const removeItem = vi.fn();
    const task = createSellBottlesTask(
      createPlacesWithCollection(),
      createNpcTaskFactory({ removeItem })
    );

    plan(task, new NpcStateBuilder().withInventory({ [Item.Bottles]: 12 }).build());

    expect(removeItem).toHaveBeenCalledExactlyOnceWith({
      item: Item.Bottles,
      count: 12,
    });
  });

  it('Получает BOTTLE_PRICE за каждую бутылку', () => {
    const addItem = vi.fn();
    const task = createSellBottlesTask(
      createPlacesWithCollection(),
      createNpcTaskFactory({ addItem })
    );

    plan(task, new NpcStateBuilder().withInventory({ [Item.Bottles]: 12 }).build());

    expect(addItem).toHaveBeenCalledExactlyOnceWith({
      item: Item.Money,
      count: 12 * BOTTLE_PRICE,
    });
  });

  it('Если бутылок ровно на пойло, а денег нет, планирует сдать бутылки', () => {
    const task = createSellBottlesTask(createPlacesWithCollection());

    const names = planNames(
      task,
      new NpcStateBuilder().withInventory({ [Item.Bottles]: BOTTLES_FOR_BOOZE }).build()
    );

    expect(names).not.toBeNull();
  });

  it('Если бутылок не хватает на пойло, а денег нет, план не составляется', () => {
    const task = createSellBottlesTask(createPlacesWithCollection());

    const names = planNames(
      task,
      new NpcStateBuilder().withInventory({ [Item.Bottles]: BOTTLES_FOR_BOOZE - 1 }).build()
    );

    expect(names).toBeNull();
  });

  it('Если бутылок вместе с деньгами хватает на пойло, планирует сдать бутылки', () => {
    const task = createSellBottlesTask(createPlacesWithCollection());
    const state = new NpcStateBuilder()
      .withInventory({
        [Item.Bottles]: 1,
        [Item.Money]: BOOZE_PRICE - BOTTLE_PRICE,
      })
      .build();

    expect(planNames(task, state)).not.toBeNull();
  });

  it('Если бутылок вместе с деньгами не хватает на пойло, план не составляется', () => {
    const task = createSellBottlesTask(createPlacesWithCollection());
    const state = new NpcStateBuilder()
      .withInventory({
        [Item.Bottles]: 1,
        [Item.Money]: BOOZE_PRICE - BOTTLE_PRICE - 1,
      })
      .build();

    expect(planNames(task, state)).toBeNull();
  });

  it('Если бутылок нет, план не составляется', () => {
    const task = createSellBottlesTask(createPlacesWithCollection());

    expect(planNames(task, new NpcStateBuilder().withEmptyInventory().build())).toBeNull();
  });
});
