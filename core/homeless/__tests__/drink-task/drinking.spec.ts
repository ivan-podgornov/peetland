import { applyPlanEffects, planNames } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { createMockedPlaces } from '@peetland/places/dev';
import { describe, expect, it, vi } from 'vitest';

import { DRINK_PLAN, createDrinkTask, createPlacesWithCamp } from '../../dev';
import { DRINK_DURATION } from '../../src/drink-task';

describe('DrinkTask', () => {
  it('Если NPC в бомжарне, планирует проиграть анимацию питья, отнять пойло и добавить пустую бутылку', () => {
    const task = createDrinkTask(createPlacesWithCamp(true));

    expect(
      planNames(task, new NpcStateBuilder().withInventory({ [Item.Booze]: 1 }).build())
    ).toStrictEqual(DRINK_PLAN);
  });

  it('Пьёт стоя в течение DRINK_DURATION', () => {
    const playAnimation = vi.fn();

    createDrinkTask(createMockedPlaces(), createNpcTaskFactory({ playAnimation }));

    expect(playAnimation).toHaveBeenCalledExactlyOnceWith({
      animation: 'drink-standing-1',
      duration: DRINK_DURATION,
    });
  });

  it('По плану отнимает бутылку пойла и добавляет пустую бутылку', () => {
    const task = createDrinkTask(createPlacesWithCamp(true));

    const after = applyPlanEffects(
      task,
      new NpcStateBuilder().withInventory({ [Item.Booze]: 3 }).build()
    );

    expect(after.self.inventory).toStrictEqual({
      [Item.Booze]: 2,
      [Item.Bottles]: 1,
    });
  });

  it('Если пойла нет, план не составляется', () => {
    const task = createDrinkTask(createPlacesWithCamp(true));

    expect(planNames(task, new NpcStateBuilder().withEmptyInventory().build())).toBeNull();
  });
});
