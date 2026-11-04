import { createStubTask, plan, planNames } from '@peetland/htn/dev';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { PlaceType } from '@peetland/places';
import { createMockedPlaces } from '@peetland/places/dev';
import { describe, expect, it, vi } from 'vitest';

import { createBuyBoozeTask, createHomelessTaskFactory, createPlacesWithShop } from '../../dev';

describe('BuyBoozeTask', () => {
  describe('Метод buy-in-nearest-shop', () => {
    describe('Предусловия', () => {
      it('Если магазины есть, план составляется', () => {
        const task = createBuyBoozeTask(createPlacesWithShop(), {
          homelessTaskFactory: createHomelessTaskFactory({
            purchase: () => createStubTask('purchase'),
          }),
        });

        expect(planNames(task, NpcStateBuilder.default())).not.toBeNull();
      });

      it('Если магазинов нет, план не составляется', () => {
        const places = createMockedPlaces({ ofType: vi.fn(() => []) });

        expect(planNames(createBuyBoozeTask(places), NpcStateBuilder.default())).toBeNull();
      });

      it('Ищет магазины среди мест типа PlaceType.Shop', () => {
        const places = createMockedPlaces();

        plan(createBuyBoozeTask(places), NpcStateBuilder.default());

        expect(places.ofType).toHaveBeenCalledWith(PlaceType.Shop);
      });
    });
  });
});
