import { plan, planNames } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import type { TryLuckTaskOptions } from '@peetland/npc-tasks';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { describe, expect, it, vi } from 'vitest';

import { createCollectBottlesTask, createPlacesWithTrashBins } from '../../dev';
import { MAX_BOTTLES, MAX_BOTTLES_PER_VISIT } from '../../src/collect-bottles-task';

describe('CollectBottlesTask', () => {
  it('Если NPC унесёт много бутылок, за заход ищет MAX_BOTTLES_PER_VISIT', () => {
    const tryLuck = vi.fn((options: TryLuckTaskOptions) => createNpcTaskFactory().tryLuck(options));
    const task = createCollectBottlesTask(
      createPlacesWithTrashBins(),
      createNpcTaskFactory({ tryLuck })
    );

    plan(task, new NpcStateBuilder().withEmptyInventory().build());

    expect(tryLuck).toHaveBeenCalledTimes(MAX_BOTTLES_PER_VISIT);
  });

  it('Если до MAX_BOTTLES осталось меньше MAX_BOTTLES_PER_VISIT, ищет столько, сколько осталось', () => {
    const tryLuck = vi.fn((options: TryLuckTaskOptions) => createNpcTaskFactory().tryLuck(options));
    const task = createCollectBottlesTask(
      createPlacesWithTrashBins(),
      createNpcTaskFactory({ tryLuck })
    );

    plan(task, new NpcStateBuilder().withInventory({ [Item.Bottles]: MAX_BOTTLES - 3 }).build());

    expect(tryLuck).toHaveBeenCalledTimes(3);
  });

  it('Если у NPC MAX_BOTTLES бутылок, план не составляется', () => {
    const task = createCollectBottlesTask(createPlacesWithTrashBins());

    const names = planNames(
      task,
      new NpcStateBuilder().withInventory({ [Item.Bottles]: MAX_BOTTLES }).build()
    );

    expect(names).toBeNull();
  });
});
