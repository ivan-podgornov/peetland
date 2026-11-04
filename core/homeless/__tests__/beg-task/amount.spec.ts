import { applyPlanEffects, plan, planNames } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createMockedRepeat, createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { Feeling } from '@peetland/psyche';
import { describe, expect, it } from 'vitest';

import { createBeggingPsycheFactory, createBegTask, createPlacesWithBeggingSpot } from '../../dev';
import { BEGGING_REWARD, BEGGING_SHAME_LIMIT } from '../../src/beg-task';
import { BOOZE_PRICE } from '../../src/buy-booze-task';
import { BOTTLE_PRICE } from '../../src/sell-bottles-task';

describe('BegTask', () => {
  it('Если ни денег, ни бутылок нет, клянчит на всё пойло', () => {
    const repeat = createMockedRepeat();

    plan(
      createBegTask(createPlacesWithBeggingSpot(), createNpcTaskFactory({ repeat })),
      new NpcStateBuilder().withEmptyInventory().build()
    );

    expect(repeat).toHaveBeenCalledExactlyOnceWith(
      BOOZE_PRICE / BEGGING_REWARD,
      expect.any(Function)
    );
  });

  it('Клянчит столько, сколько не хватает на пойло вместе с деньгами и выручкой за бутылки', () => {
    const repeat = createMockedRepeat();
    const state = new NpcStateBuilder()
      .withInventory({
        [Item.Money]: 3 * BEGGING_REWARD,
        [Item.Bottles]: 2,
      })
      .build();

    plan(createBegTask(createPlacesWithBeggingSpot(), createNpcTaskFactory({ repeat })), state);

    expect(repeat).toHaveBeenCalledExactlyOnceWith(
      (BOOZE_PRICE - 3 * BEGGING_REWARD - 2 * BOTTLE_PRICE) / BEGGING_REWARD,
      expect.any(Function)
    );
  });

  it('Если не хватает не кратно BEGGING_REWARD, клянчит с запасом до целой удачи', () => {
    const repeat = createMockedRepeat();
    const state = new NpcStateBuilder()
      .withInventory({ [Item.Money]: BOOZE_PRICE - BEGGING_REWARD - 1 })
      .build();

    plan(createBegTask(createPlacesWithBeggingSpot(), createNpcTaskFactory({ repeat })), state);

    expect(repeat).toHaveBeenCalledExactlyOnceWith(2, expect.any(Function));
  });

  it('Если на пойло хватает денег и выручки за бутылки, план не составляется', () => {
    const task = createBegTask(createPlacesWithBeggingSpot());
    const state = new NpcStateBuilder()
      .withInventory({
        [Item.Money]: BOOZE_PRICE - BOTTLE_PRICE,
        [Item.Bottles]: 1,
      })
      .build();

    expect(planNames(task, state)).toBeNull();
  });

  it('За удачу получает BEGGING_REWARD', () => {
    const task = createBegTask(
      createPlacesWithBeggingSpot(),
      createNpcTaskFactory({ repeat: createMockedRepeat() })
    );
    const state = new NpcStateBuilder()
      .withInventory({ [Item.Money]: BOOZE_PRICE - 2 * BEGGING_REWARD })
      .build();

    const after = applyPlanEffects(task, state);

    expect(after.self.inventory).toStrictEqual({ [Item.Money]: BOOZE_PRICE - BEGGING_REWARD });
  });

  describe('При 20 стыда за удачу, когда до BEGGING_SHAME_LIMIT успевают 3 удачи', () => {
    // 40 попыток на удачу по 0.5 стыда: перед удачами стыд 0, 20, 40, а перед четвёртой — уже 60

    it('Если нужно 3 удачи, планирует клянчить', () => {
      const task = createBegTask(
        createPlacesWithBeggingSpot(),
        createNpcTaskFactory(),
        createBeggingPsycheFactory(0.5)
      );
      const state = new NpcStateBuilder()
        .withInventory({ [Item.Money]: BOOZE_PRICE - 3 * BEGGING_REWARD })
        .build();

      expect(planNames(task, state)).not.toBeNull();
    });

    it('Если нужно 4 удачи, план не составляется', () => {
      const task = createBegTask(
        createPlacesWithBeggingSpot(),
        createNpcTaskFactory(),
        createBeggingPsycheFactory(0.5)
      );
      const state = new NpcStateBuilder()
        .withInventory({ [Item.Money]: BOOZE_PRICE - 4 * BEGGING_REWARD })
        .build();

      expect(planNames(task, state)).toBeNull();
    });
  });

  it('Если стыд достиг BEGGING_SHAME_LIMIT, план не составляется', () => {
    const task = createBegTask(createPlacesWithBeggingSpot());

    expect(
      planNames(task, new NpcStateBuilder().withFeeling(Feeling.Shame, BEGGING_SHAME_LIMIT).build())
    ).toBeNull();
  });
});
