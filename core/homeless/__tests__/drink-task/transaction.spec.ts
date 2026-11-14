import { PlanStructureBuilder, planSteps, planTree } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { createDrinkTask, createPlacesWithCamp } from '../../dev';

/** Собирает в переданном билдере транзакцию выпить пойло */
function drinkBooze(structure: PlanStructureBuilder) {
  return structure.transaction('drink-booze', 'drink-booze', (drink) =>
    drink.primitive('play-animation').primitive('remove-item').primitive('add-item')
  );
}

describe('DrinkTask', () => {
  it('Если NPC в бомжарне, выпивает одной транзакцией', () => {
    const task = createDrinkTask(createPlacesWithCamp(true));
    const state = new NpcStateBuilder().withInventory({ [Item.Booze]: 1 }).build();

    const tree = planTree(planSteps(task, state) ?? []);

    expect(tree).toStrictEqual(
      new PlanStructureBuilder().compound('drink', 'drink-in-camp', drinkBooze).build()
    );
  });

  it('Если NPC не в бомжарне, идёт до неё вне транзакции, а выпивает одной транзакцией', () => {
    const task = createDrinkTask(createPlacesWithCamp(false));
    const state = new NpcStateBuilder().withInventory({ [Item.Booze]: 1 }).build();

    const tree = planTree(planSteps(task, state) ?? []);

    expect(tree).toStrictEqual(
      new PlanStructureBuilder()
        .compound('drink', 'go-to-camp-and-drink', (drink) =>
          drinkBooze(drink.primitive('go-to-coords'))
        )
        .build()
    );
  });
});
