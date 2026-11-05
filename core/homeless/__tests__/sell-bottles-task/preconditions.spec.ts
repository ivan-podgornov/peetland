import { plan, planNames } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { PlaceType } from '@peetland/places';
import { createMockedPlaces } from '@peetland/places/dev';
import { describe, expect, it, vi } from 'vitest';

import { BOTTLES_FOR_BOOZE, createPlacesWithCollection, createSellBottlesTask } from '../../dev';
import { BOOZE_PRICE, BOTTLE_PRICE } from '../../src/constants';

describe('SellBottlesTask', () => {
  describe('Метод sell-in-nearest-collection', () => {
    describe('Предусловия', () => {
      it('Если бутылок ровно на пойло, а денег нет, план составляется', () => {
        const task = createSellBottlesTask(createPlacesWithCollection());
        const state = new NpcStateBuilder()
          .withInventory({ [Item.Bottles]: BOTTLES_FOR_BOOZE })
          .build();

        expect(planNames(task, state)).not.toBeNull();
      });

      it('Если бутылок не хватает на пойло, а денег нет, план не составляется', () => {
        const task = createSellBottlesTask(createPlacesWithCollection());
        const state = new NpcStateBuilder()
          .withInventory({ [Item.Bottles]: BOTTLES_FOR_BOOZE - 1 })
          .build();

        expect(planNames(task, state)).toBeNull();
      });

      it('Если выручки за бутылки вместе с деньгами хватает на пойло, план составляется', () => {
        const task = createSellBottlesTask(createPlacesWithCollection());
        const state = new NpcStateBuilder()
          .withInventory({
            [Item.Bottles]: 1,
            [Item.Money]: BOOZE_PRICE - BOTTLE_PRICE,
          })
          .build();

        expect(planNames(task, state)).not.toBeNull();
      });

      it('Если выручки за бутылки вместе с деньгами не хватает на пойло, план не составляется', () => {
        const task = createSellBottlesTask(createPlacesWithCollection());
        const state = new NpcStateBuilder()
          .withInventory({
            [Item.Bottles]: 1,
            [Item.Money]: BOOZE_PRICE - BOTTLE_PRICE - 1,
          })
          .build();

        expect(planNames(task, state)).toBeNull();
      });

      it('Если ни бутылок, ни денег нет, план не составляется', () => {
        const task = createSellBottlesTask(createPlacesWithCollection());

        expect(planNames(task, new NpcStateBuilder().withEmptyInventory().build())).toBeNull();
      });

      it('Если бутылок нет, план не составляется, даже если денег хватает на пойло', () => {
        const task = createSellBottlesTask(createPlacesWithCollection());
        const state = new NpcStateBuilder().withInventory({ [Item.Money]: BOOZE_PRICE }).build();

        expect(planNames(task, state)).toBeNull();
      });

      it('Если приёмок нет, план не составляется', () => {
        const places = createMockedPlaces({ ofType: vi.fn(() => []) });
        const state = new NpcStateBuilder()
          .withInventory({ [Item.Bottles]: BOTTLES_FOR_BOOZE })
          .build();

        expect(planNames(createSellBottlesTask(places), state)).toBeNull();
      });

      it('Ищет приёмки среди мест типа PlaceType.BottleCollection', () => {
        const places = createMockedPlaces();
        const state = new NpcStateBuilder()
          .withInventory({ [Item.Bottles]: BOTTLES_FOR_BOOZE })
          .build();

        plan(createSellBottlesTask(places), state);

        expect(places.ofType).toHaveBeenCalledWith(PlaceType.BottleCollection);
      });
    });
  });
});
