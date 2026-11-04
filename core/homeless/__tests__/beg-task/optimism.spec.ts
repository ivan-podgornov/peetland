import { plan } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { Feeling } from '@peetland/psyche';
import { createMockedOptimism } from '@peetland/psyche/dev';
import { describe, expect, it } from 'vitest';

import {
  createBeggingPsycheFactory,
  createBegTask,
  createPlacesWithBeggingSpot,
  createTaskFactoryWithTryLuckSpy,
} from '../../dev';
import { BEGGING_CHANCE, BEGGING_REWARD } from '../../src/beg-task';
import { BOOZE_PRICE } from '../../src/buy-booze-task';

describe('BegTask', () => {
  describe('Ожидание попыток', () => {
    it('Спрашивает психику, сколько попыток NPC ожидает при шансе BEGGING_CHANCE', () => {
      const optimism = createMockedOptimism();
      const task = createBegTask(
        createPlacesWithBeggingSpot(),
        createNpcTaskFactory(),
        createBeggingPsycheFactory(0.5, optimism)
      );

      plan(task, NpcStateBuilder.default());

      expect(optimism.expectAttempts).toHaveBeenCalledWith(BEGGING_CHANCE);
    });

    it('Предсказывает стыд так, будто на удачу ушло столько попыток, сколько NPC ожидает', () => {
      const { tryLuck, npcTaskFactory } = createTaskFactoryWithTryLuckSpy();
      const optimism = createMockedOptimism();
      optimism.expectAttempts.mockReturnValue(10);
      plan(
        createBegTask(
          createPlacesWithBeggingSpot(),
          npcTaskFactory,
          createBeggingPsycheFactory(0.5, optimism)
        ),
        new NpcStateBuilder().withInventory({ [Item.Money]: BOOZE_PRICE - BEGGING_REWARD }).build()
      );

      const after = tryLuck.mock.calls[0]?.[0].applyEffects?.(
        new NpcStateBuilder().withFeeling(Feeling.Shame, 10).build()
      );

      // 10 + 10 попыток по 0.5
      expect(after?.self.psyche.feelings).toStrictEqual({ [Feeling.Shame]: 15 });
    });

    it('Если NPC ожидает 30 попыток на удачу, планирует клянчить 4 удачи, на которые реалисту не хватит стыда', () => {
      const optimism = createMockedOptimism();
      optimism.expectAttempts.mockReturnValue(30);
      const task = createBegTask(
        createPlacesWithBeggingSpot(),
        createNpcTaskFactory(),
        createBeggingPsycheFactory(0.5, optimism)
      );
      const state = new NpcStateBuilder()
        .withInventory({ [Item.Money]: BOOZE_PRICE - 4 * BEGGING_REWARD })
        .build();

      // 30 попыток по 0.5 стыда: перед удачами стыд 0, 15, 30, 45 — ниже порога
      expect(plan(task, state)).not.toBeNull();
    });

    it('Если NPC ожидает 60 попыток на удачу, не планирует клянчить 3 удачи, на которые реалисту хватит стыда', () => {
      const optimism = createMockedOptimism();
      optimism.expectAttempts.mockReturnValue(60);
      const task = createBegTask(
        createPlacesWithBeggingSpot(),
        createNpcTaskFactory(),
        createBeggingPsycheFactory(0.5, optimism)
      );
      const state = new NpcStateBuilder()
        .withInventory({ [Item.Money]: BOOZE_PRICE - 3 * BEGGING_REWARD })
        .build();

      // 60 попыток по 0.5 стыда: перед третьей удачей стыд уже 60
      expect(plan(task, state)).toBeNull();
    });
  });
});
