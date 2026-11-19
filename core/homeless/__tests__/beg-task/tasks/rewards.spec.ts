import { applyPlanEffects, plan } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import {
  createBeggingOptimism,
  createBegTask,
  createPlacesWithBeggingSpot,
  createTaskFactoryWithTryLuckSpy,
  withBeggingTraits,
} from '../../../dev';
import { BEGGING_REWARD, MAX_BEGGING_REWARDS_PER_VISIT } from '../../../src/constants';

/** Состояние NPC, у которого каждая попытка добавляет shame стыда, а до подачки он ждёт attempts */
function createState(shame: number, attempts: number) {
  return new NpcStateBuilder()
    .withPsyche((psyche) =>
      withBeggingTraits(psyche, shame, createBeggingOptimism(attempts)).build()
    )
    .withEmptyInventory()
    .build();
}

describe('BegTask', () => {
  describe('Метод beg-at-nearest-spot', () => {
    describe('Задачи', () => {
      it('Пытает удачу столько раз, сколько подачек, по ожиданию психики, успеет получить до BEGGING_SHAME_LIMIT', () => {
        const { tryLuck, npcTaskFactory } = createTaskFactoryWithTryLuckSpy();

        // 30 попыток на подачку по 0.5 стыда: после подачек стыд 15, 30, 45, а после четвёртой — 60
        plan(createBegTask(createPlacesWithBeggingSpot(), npcTaskFactory), createState(0.5, 30));

        expect(tryLuck).toHaveBeenCalledTimes(3);
      });

      it('Если стыд не растёт, пытает удачу MAX_BEGGING_REWARDS_PER_VISIT раз', () => {
        const { tryLuck, npcTaskFactory } = createTaskFactoryWithTryLuckSpy();

        plan(createBegTask(createPlacesWithBeggingSpot(), npcTaskFactory), createState(0, 30));

        expect(tryLuck).toHaveBeenCalledTimes(MAX_BEGGING_REWARDS_PER_VISIT);
      });

      it('За каждую подачку получает BEGGING_REWARD', () => {
        const task = createBegTask(createPlacesWithBeggingSpot());

        const after = applyPlanEffects(task, createState(0.5, 30));

        expect(after.self.inventory.getAll()).toStrictEqual({ [Item.Money]: 3 * BEGGING_REWARD });
      });
    });
  });
});
