import { createStubTask, planSteps, PlanStructureBuilder, planTree } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import type { NpcContext, NpcState } from '@peetland/npc';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createNpcTaskFactory, createStubNpcTask } from '@peetland/npc-tasks/dev';
import { describe, expect, it, vi } from 'vitest';

import { TEST_SHOP } from '../dev';
import { BuyBoozeTask } from '../src/buy-booze-task';
import { BOOZE_PRICE } from '../src/constants';

describe('BuyBoozeTask', () => {
  it('Планирует дойти до магазина, повернуться к прилавку и купить пойло', () => {
    const task = new BuyBoozeTask(
      { shop: TEST_SHOP },
      { npcTaskFactory: createNpcTaskFactory({ purchase: () => createStubTask('purchase') }) }
    );

    expect(planTree(planSteps(task, NpcStateBuilder.default()) ?? [])).toStrictEqual(
      new PlanStructureBuilder()
        .compound('buy-booze', 'go-to-shop', (buy) =>
          buy.primitive('go-to-coords').primitive('achieve-angle').primitive('purchase')
        )
        .build()
    );
  });

  it('Идёт к переданному магазину и поворачивается к прилавку', () => {
    const goToCoords = vi.fn(() => createStubNpcTask('go-to-coords'));
    const achieveAngle = vi.fn(() => createStubNpcTask('achieve-angle'));

    new BuyBoozeTask(
      { shop: TEST_SHOP },
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

  it('Покупает одну бутылку пойла за BOOZE_PRICE', () => {
    const purchase = vi.fn(() => createStubTask<NpcState, NpcContext>('purchase'));

    new BuyBoozeTask({ shop: TEST_SHOP }, { npcTaskFactory: createNpcTaskFactory({ purchase }) });

    expect(purchase).toHaveBeenCalledExactlyOnceWith({
      item: Item.Booze,
      count: 1,
      price: BOOZE_PRICE,
    });
  });
});
