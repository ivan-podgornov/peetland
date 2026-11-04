import { plan } from '@peetland/htn/dev';
import { createNpcContext, NpcStateBuilder } from '@peetland/npc/dev';
import { Deed, Feeling } from '@peetland/psyche';
import { createMockedPsyche } from '@peetland/psyche/dev';
import { describe, expect, it } from 'vitest';

import {
  createBegTask,
  createPlacesWithBeggingSpot,
  createTaskFactoryWithTryLuckSpy,
} from '../../dev';
import { BEGGING_SHAME_LIMIT } from '../../src/beg-task';

describe('BegTask', () => {
  describe('Каждая попытка', () => {
    it('Сообщает психике NPC о поступке Deed.Begging', () => {
      const { tryLuck, npcTaskFactory } = createTaskFactoryWithTryLuckSpy();
      const psyche = createMockedPsyche();
      plan(createBegTask(createPlacesWithBeggingSpot(), npcTaskFactory), NpcStateBuilder.default());

      tryLuck.mock.calls[0]?.[0].onAttempt?.({
        ...createNpcContext(),
        psyche,
      });

      expect(psyche.react).toHaveBeenCalledExactlyOnceWith(Deed.Begging);
    });

    it('Если стыд достиг BEGGING_SHAME_LIMIT, останавливает клянчанье', () => {
      const { tryLuck, npcTaskFactory } = createTaskFactoryWithTryLuckSpy();
      plan(createBegTask(createPlacesWithBeggingSpot(), npcTaskFactory), NpcStateBuilder.default());

      const stop = tryLuck.mock.calls[0]?.[0].stopWhen?.(
        new NpcStateBuilder().withFeeling(Feeling.Shame, BEGGING_SHAME_LIMIT).build()
      );

      expect(stop).toBe(true);
    });

    it('Если стыд ниже BEGGING_SHAME_LIMIT, не останавливает клянчанье', () => {
      const { tryLuck, npcTaskFactory } = createTaskFactoryWithTryLuckSpy();
      plan(createBegTask(createPlacesWithBeggingSpot(), npcTaskFactory), NpcStateBuilder.default());

      const stop = tryLuck.mock.calls[0]?.[0].stopWhen?.(
        new NpcStateBuilder().withFeeling(Feeling.Shame, BEGGING_SHAME_LIMIT - 1).build()
      );

      expect(stop).toBe(false);
    });

    it('Предсказание стыда не меняет то, что NPC знает о мире', () => {
      const { tryLuck, npcTaskFactory } = createTaskFactoryWithTryLuckSpy();
      plan(createBegTask(createPlacesWithBeggingSpot(), npcTaskFactory), NpcStateBuilder.default());

      const after = tryLuck.mock.calls[0]?.[0].applyEffects?.(
        new NpcStateBuilder()
          .withTime({
            day: 1,
            hours: 20,
            minutes: 0,
          })
          .build()
      );

      expect(after?.world).toStrictEqual({
        time: {
          day: 1,
          hours: 20,
          minutes: 0,
        },
      });
    });
  });
});
