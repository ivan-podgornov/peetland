import { planSteps } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { createDrinkTask, createPlacesWithCamp } from '../../dev';

describe('DrinkTask', () => {
  it('Если NPC в бомжарне, выпивает одной транзакцией', () => {
    const task = createDrinkTask(createPlacesWithCamp(true));
    const state = new NpcStateBuilder().withInventory({ [Item.Booze]: 1 }).build();

    const steps = planSteps(task, state) ?? [];

    expect(steps.map((step) => step.isPartOf?.task.transaction ?? false)).toStrictEqual([
      true,
      true,
      true,
    ]);
  });

  it('Если NPC не в бомжарне, идёт до неё вне транзакции, а выпивает одной транзакцией', () => {
    const task = createDrinkTask(createPlacesWithCamp(false));
    const state = new NpcStateBuilder().withInventory({ [Item.Booze]: 1 }).build();

    const steps = planSteps(task, state) ?? [];

    expect(steps.map((step) => step.isPartOf?.task.transaction ?? false)).toStrictEqual([
      false,
      true,
      true,
      true,
    ]);
  });
});
