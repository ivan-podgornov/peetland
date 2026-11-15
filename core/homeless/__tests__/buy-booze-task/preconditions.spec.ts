import { plan, planSteps } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { PlaceType } from '@peetland/places';
import { createMockedPlaces } from '@peetland/places/dev';
import { describe, expect, it, vi } from 'vitest';

import { createBuyBoozeTask, createPlacesWithShop } from '../../dev';
import { BOOZE_PRICE } from '../../src/constants';

describe('BuyBoozeTask', () => {
  describe('Метод buy-in-nearest-shop', () => {
    describe('Предусловия', () => {
      it('Если денег хватает на пойло и магазины есть, план составляется', () => {
        const task = createBuyBoozeTask(createPlacesWithShop());
        const state = new NpcStateBuilder().withInventory({ [Item.Money]: BOOZE_PRICE }).build();

        expect(planSteps(task, state)).not.toBeNull();
      });

      it('Если денег не хватает на пойло, план не составляется', () => {
        const task = createBuyBoozeTask(createPlacesWithShop());
        const state = new NpcStateBuilder()
          .withInventory({ [Item.Money]: BOOZE_PRICE - 1 })
          .build();

        expect(planSteps(task, state)).toBeNull();
      });

      it('Если магазинов нет, план не составляется', () => {
        const places = createMockedPlaces({ ofType: vi.fn(() => []) });
        const state = new NpcStateBuilder().withInventory({ [Item.Money]: BOOZE_PRICE }).build();

        expect(planSteps(createBuyBoozeTask(places), state)).toBeNull();
      });

      it('Ищет магазины среди мест типа PlaceType.Shop', () => {
        const places = createMockedPlaces();
        const state = new NpcStateBuilder().withInventory({ [Item.Money]: BOOZE_PRICE }).build();

        plan(createBuyBoozeTask(places), state);

        expect(places.ofType).toHaveBeenCalledWith(PlaceType.Shop);
      });
    });
  });
});
