import { createStubTask, planSteps, PlanStructureBuilder, planTree } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import type { NpcContext, NpcState } from '@peetland/npc';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createNpcTaskFactory, createStubNpcTask } from '@peetland/npc-tasks/dev';
import { TEST_SHOP } from '@peetland/places/dev';
import { describe, expect, it, vi } from 'vitest';

import { BuyFoodTask } from '../src/buy-food-task';
import { FOOD_PRICES } from '../src/constants';

describe('BuyFoodTask', () => {
  it('Планирует дойти до магазина, повернуться к прилавку и купить еду', () => {
    const task = new BuyFoodTask(
      {
        food: Item.SmilePizza,
        shop: TEST_SHOP,
      },
      { npcTaskFactory: createNpcTaskFactory({ purchase: () => createStubTask('purchase') }) }
    );

    expect(planTree(planSteps(task, NpcStateBuilder.default()) ?? [])).toStrictEqual(
      new PlanStructureBuilder()
        .compound('buy-food', 'go-to-shop', (buy) =>
          buy.primitive('go-to-coords').primitive('achieve-angle').primitive('purchase')
        )
        .build()
    );
  });

  it('Идёт к переданному магазину и поворачивается к прилавку', () => {
    const goToCoords = vi.fn(() => createStubNpcTask('go-to-coords'));
    const achieveAngle = vi.fn(() => createStubNpcTask('achieve-angle'));

    new BuyFoodTask(
      {
        food: Item.SmilePizza,
        shop: TEST_SHOP,
      },
      {
        npcTaskFactory: createNpcTaskFactory({
          goToCoords,
          achieveAngle,
        }),
      }
    );

    expect(goToCoords).toHaveBeenCalledExactlyOnceWith({
      coords: TEST_SHOP.position,
      completeRadius: 0.5,
    });
    expect(achieveAngle).toHaveBeenCalledExactlyOnceWith({
      angle: TEST_SHOP.angle,
      tolerance: 15,
    });
  });

  it('Покупает одну штуку переданной еды по её цене', () => {
    const purchase = vi.fn(() => createStubTask<NpcState, NpcContext>('purchase'));

    new BuyFoodTask(
      {
        food: Item.SmilePizza,
        shop: TEST_SHOP,
      },
      { npcTaskFactory: createNpcTaskFactory({ purchase }) }
    );

    expect(purchase).toHaveBeenCalledExactlyOnceWith({
      item: Item.SmilePizza,
      count: 1,
      price: FOOD_PRICES[Item.SmilePizza],
    });
  });
});
