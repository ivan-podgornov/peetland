import { plan, planSteps } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { PlaceType } from '@peetland/places';
import { createMockedPlaces } from '@peetland/places/dev';
import { describe, expect, it, vi } from 'vitest';

import { createPlacesWithCollection, createSellBottlesTask } from '../../dev';
import { BOTTLES_TO_SELL } from '../../src/constants';

/** Состояние NPC с переданным числом бутылок, денег нет */
function createStateWithBottles(bottles: number) {
  return new NpcStateBuilder().withInventory({ [Item.Bottles]: bottles }).build();
}

describe('SellBottlesTask', () => {
  describe('Метод sell-in-nearest-collection', () => {
    describe('Предусловия', () => {
      it('Если бутылок ровно BOTTLES_TO_SELL, план составляется', () => {
        const task = createSellBottlesTask(createPlacesWithCollection());

        expect(planSteps(task, createStateWithBottles(BOTTLES_TO_SELL))).not.toBeNull();
      });

      it('Если бутылок больше BOTTLES_TO_SELL, план составляется', () => {
        const task = createSellBottlesTask(createPlacesWithCollection());

        expect(planSteps(task, createStateWithBottles(BOTTLES_TO_SELL + 1))).not.toBeNull();
      });

      it('Если бутылок меньше BOTTLES_TO_SELL, план не составляется', () => {
        const task = createSellBottlesTask(createPlacesWithCollection());

        expect(planSteps(task, createStateWithBottles(BOTTLES_TO_SELL - 1))).toBeNull();
      });

      it('Если бутылок меньше BOTTLES_TO_SELL, план не составляется, даже если с выручкой хватит на пойло', () => {
        const task = createSellBottlesTask(createPlacesWithCollection());
        const state = new NpcStateBuilder()
          .withInventory({
            [Item.Bottles]: 1,
            [Item.Money]: 1000,
          })
          .build();

        expect(planSteps(task, state)).toBeNull();
      });

      it('Если приёмок нет, план не составляется', () => {
        const places = createMockedPlaces({ ofType: vi.fn(() => []) });

        expect(
          planSteps(createSellBottlesTask(places), createStateWithBottles(BOTTLES_TO_SELL))
        ).toBeNull();
      });

      it('Ищет приёмки среди мест типа PlaceType.BottleCollection', () => {
        const places = createMockedPlaces();

        plan(createSellBottlesTask(places), createStateWithBottles(BOTTLES_TO_SELL));

        expect(places.ofType).toHaveBeenCalledWith(PlaceType.BottleCollection);
      });
    });
  });
});
