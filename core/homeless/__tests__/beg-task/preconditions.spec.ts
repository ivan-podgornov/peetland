import { planSteps } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createMockedPlaces } from '@peetland/places/dev';
import { Feeling } from '@peetland/psyche';
import { describe, expect, it, vi } from 'vitest';

import {
  createBeggingOptimism,
  createBegTask,
  createPlacesWithBeggingSpot,
  withBeggingTraits,
} from '../../dev';
import { BEGGING_SHAME_LIMIT } from '../../src/constants';

describe('BegTask', () => {
  describe('Метод beg-at-nearest-spot', () => {
    describe('Предусловия', () => {
      it('Если стыд достиг BEGGING_SHAME_LIMIT, план не составляется', () => {
        const task = createBegTask(createPlacesWithBeggingSpot());
        const state = new NpcStateBuilder()
          .withPsyche((psyche) => psyche.withFeeling(Feeling.Shame, BEGGING_SHAME_LIMIT).build())
          .build();

        expect(planSteps(task, state)).toBeNull();
      });

      it('Если мест для попрошайничества нет, план не составляется', () => {
        const places = createMockedPlaces({ ofType: vi.fn(() => []) });

        expect(planSteps(createBegTask(places), NpcStateBuilder.default())).toBeNull();
      });

      it('Не зависит от денег: даже если денег много, планирует попрошайничать', () => {
        const task = createBegTask(createPlacesWithBeggingSpot());
        const state = new NpcStateBuilder().withInventory({ [Item.Money]: 1000 }).build();

        expect(planSteps(task, state)).not.toBeNull();
      });

      it('Если по ожиданию психики NPC успеет получить подачку до BEGGING_SHAME_LIMIT, планирует попрошайничать', () => {
        const task = createBegTask(createPlacesWithBeggingSpot());
        const state = new NpcStateBuilder()
          .withPsyche((psyche) =>
            withBeggingTraits(
              psyche.withFeeling(Feeling.Shame, 40),
              0.5,
              createBeggingOptimism(30)
            ).build()
          )
          .build();

        // 30 попыток на подачку по 0.5 стыда: после неё стыд 55, ещё ниже порога
        expect(planSteps(task, state)).not.toBeNull();
      });

      it('Если по ожиданию психики NPC не успеет получить ни одной подачки до BEGGING_SHAME_LIMIT, план не составляется', () => {
        const task = createBegTask(createPlacesWithBeggingSpot());
        const state = new NpcStateBuilder()
          .withPsyche((psyche) =>
            withBeggingTraits(
              psyche.withFeeling(Feeling.Shame, 40),
              0.5,
              createBeggingOptimism(60)
            ).build()
          )
          .build();

        // 60 попыток на подачку по 0.5 стыда: до неё стыд дорастёт до 70
        expect(planSteps(task, state)).toBeNull();
      });
    });
  });
});
