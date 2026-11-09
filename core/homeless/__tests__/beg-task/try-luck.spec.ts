import { plan } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { createNpcContext, NpcStateBuilder } from '@peetland/npc/dev';
import { Deed, Feeling } from '@peetland/psyche';
import { createMockedPsyche } from '@peetland/psyche/dev';
import { describe, expect, it } from 'vitest';

import {
  createBeggingOptimism,
  createBegTask,
  createPlacesWithBeggingSpot,
  createTaskFactoryWithTryLuckSpy,
  withBeggingTraits,
} from '../../dev';
import {
  BEGGING_CHANCE,
  BEGGING_REWARD,
  BEGGING_SHAME_LIMIT,
  BOOZE_PRICE,
} from '../../src/constants';

/** Планирует клянчанье на одну удачу и возвращает опции, с которыми задача пытает удачу */
function planTryLuck() {
  const { tryLuck, npcTaskFactory } = createTaskFactoryWithTryLuckSpy();
  plan(
    createBegTask(createPlacesWithBeggingSpot(), npcTaskFactory),
    new NpcStateBuilder().withInventory({ [Item.Money]: BOOZE_PRICE - BEGGING_REWARD }).build()
  );

  return tryLuck.mock.calls[0]?.[0];
}

describe('BegTask', () => {
  describe('Метод beg-at-nearest-spot', () => {
    describe('Опции tryLuck', () => {
      it('Пытает удачу с шансом BEGGING_CHANCE', () => {
        expect(planTryLuck()?.chance).toBe(BEGGING_CHANCE);
      });

      it('На каждую попытку сообщает психике NPC о поступке Deed.Begging', () => {
        const psyche = createMockedPsyche();

        planTryLuck()?.onAttempt?.({
          ...createNpcContext(),
          psyche,
        });

        expect(psyche.react).toHaveBeenCalledExactlyOnceWith(Deed.Begging);
      });

      it('Если стыд достиг BEGGING_SHAME_LIMIT, останавливает клянчанье', () => {
        const state = new NpcStateBuilder()
          .withPsyche((psyche) => psyche.withFeeling(Feeling.Shame, BEGGING_SHAME_LIMIT).build())
          .build();

        expect(planTryLuck()?.stopWhen?.(state)).toBe(true);
      });

      it('Если стыд ниже BEGGING_SHAME_LIMIT, не останавливает клянчанье', () => {
        const state = new NpcStateBuilder()
          .withPsyche((psyche) =>
            psyche.withFeeling(Feeling.Shame, BEGGING_SHAME_LIMIT - 1).build()
          )
          .build();

        expect(planTryLuck()?.stopWhen?.(state)).toBe(false);
      });

      it('Предсказывает стыд так, будто клянчил столько раз, сколько психика NPC ожидает попыток до удачи при BEGGING_CHANCE', () => {
        const options = planTryLuck();

        const after = options?.applyEffects?.(
          new NpcStateBuilder()
            .withPsyche((psyche) =>
              withBeggingTraits(psyche, 0.5, createBeggingOptimism(10))
                .withFeeling(Feeling.Shame, 10)
                .build()
            )
            .build()
        );

        // 10 + 10 попыток по 0.5
        expect(after?.self.psyche.getState().feelings).toStrictEqual({ [Feeling.Shame]: 15 });
      });

      it('Предсказание стыда не меняет то, что NPC знает о мире', () => {
        const state = NpcStateBuilder.default();

        expect(planTryLuck()?.applyEffects?.(state).world).toBe(state.world);
      });
    });
  });
});
