import { PlanStructureBuilder, planSteps, planTree } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { createPurchaseTask } from '../../dev';

describe('PurchaseTask', () => {
  it('Является транзакцией: если NPC заплатил, он не уйдёт без предмета', () => {
    const task = createPurchaseTask({ price: 100 });
    const state = new NpcStateBuilder().withInventory({ [Item.Money]: 100 }).build();

    const tree = planTree(planSteps(task, state) ?? []);

    expect(tree).toStrictEqual(
      new PlanStructureBuilder()
        .transaction('purchase', 'pay', (pay) =>
          pay.primitive('play-animation').primitive('remove-item').primitive('add-item')
        )
        .build()
    );
  });
});
