import { planNames } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createMockedPlaces } from '@peetland/places/dev';
import { Feeling } from '@peetland/psyche';
import { describe, expect, it, vi } from 'vitest';

import {
  createBeggingOptimism,
  createBeggingPsycheFactory,
  createBegTask,
  createPlacesWithBeggingSpot,
} from '../../dev';
import {
  BEGGING_REWARD,
  BEGGING_SHAME_LIMIT,
  BOOZE_PRICE,
  BOTTLE_PRICE,
} from '../../src/constants';

describe('BegTask', () => {
  describe('Метод beg-at-nearest-spot', () => {
    describe('Предусловия', () => {
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

      it('Если стыд достиг BEGGING_SHAME_LIMIT, план не составляется', () => {
        const task = createBegTask(createPlacesWithBeggingSpot());
        const state = new NpcStateBuilder().withFeeling(Feeling.Shame, BEGGING_SHAME_LIMIT).build();

        expect(planNames(task, state)).toBeNull();
      });

      it('Если мест для клянчанья нет, план не составляется', () => {
        const places = createMockedPlaces({ ofType: vi.fn(() => []) });

        expect(planNames(createBegTask(places), NpcStateBuilder.default())).toBeNull();
      });

      it('Если по ожиданию психики NPC успеет наклянчить на пойло до BEGGING_SHAME_LIMIT, планирует клянчить', () => {
        const task = createBegTask(createPlacesWithBeggingSpot());
        const state = new NpcStateBuilder()
          .withPsycheFactory(createBeggingPsycheFactory(0.5, createBeggingOptimism(30)))
          .withInventory({ [Item.Money]: BOOZE_PRICE - 4 * BEGGING_REWARD })
          .build();

        // 30 попыток на удачу по 0.5 стыда: перед четырьмя удачами стыд 0, 15, 30, 45
        expect(planNames(task, state)).not.toBeNull();
      });

      it('Если по ожиданию психики NPC не успеет наклянчить на пойло до BEGGING_SHAME_LIMIT, план не составляется', () => {
        const task = createBegTask(createPlacesWithBeggingSpot());
        const state = new NpcStateBuilder()
          .withPsycheFactory(createBeggingPsycheFactory(0.5, createBeggingOptimism(60)))
          .withInventory({ [Item.Money]: BOOZE_PRICE - 3 * BEGGING_REWARD })
          .build();

        // 60 попыток на удачу по 0.5 стыда: перед третьей удачей стыд уже 60
        expect(planNames(task, state)).toBeNull();
      });
    });
  });
});
