import { plan, planNames } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import type { TryLuckTaskOptions } from '@peetland/npc-tasks';
import { createMockedRepeat, createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { describe, expect, it, vi } from 'vitest';

import { createCollectBottlesTask, createPlacesWithTrashBins } from '../../dev';
import { MAX_BOTTLES, MAX_BOTTLES_PER_VISIT } from '../../src/collect-bottles-task';

/**
 * Создаёт фабрику задач, которая запоминает попытки удачи и то, сколько повторений поиска попросили.
 * Цепочку поиска бутылки она собирает один раз: одна попытка удачи на цепочку и число повторений в
 * repeat вместе значат, сколько раз NPC будет пытать удачу
 */
function createTaskFactoryWithSpies() {
  const tryLuck = vi.fn((options: TryLuckTaskOptions) => createNpcTaskFactory().tryLuck(options));
  const repeat = createMockedRepeat();

  return {
    tryLuck,
    repeat,
    npcTaskFactory: createNpcTaskFactory({
      tryLuck,
      repeat,
    }),
  };
}

describe('CollectBottlesTask', () => {
  it('Если NPC унесёт много бутылок, за заход ищет MAX_BOTTLES_PER_VISIT', () => {
    const { tryLuck, repeat, npcTaskFactory } = createTaskFactoryWithSpies();
    const task = createCollectBottlesTask(createPlacesWithTrashBins(), npcTaskFactory);

    plan(task, new NpcStateBuilder().withEmptyInventory().build());

    expect(repeat).toHaveBeenCalledExactlyOnceWith(MAX_BOTTLES_PER_VISIT, expect.any(Function));
    expect(tryLuck).toHaveBeenCalledOnce();
  });

  it('Если до MAX_BOTTLES осталось меньше MAX_BOTTLES_PER_VISIT, ищет столько, сколько осталось', () => {
    const { tryLuck, repeat, npcTaskFactory } = createTaskFactoryWithSpies();
    const task = createCollectBottlesTask(createPlacesWithTrashBins(), npcTaskFactory);

    plan(task, new NpcStateBuilder().withInventory({ [Item.Bottles]: MAX_BOTTLES - 3 }).build());

    expect(repeat).toHaveBeenCalledExactlyOnceWith(3, expect.any(Function));
    expect(tryLuck).toHaveBeenCalledOnce();
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
