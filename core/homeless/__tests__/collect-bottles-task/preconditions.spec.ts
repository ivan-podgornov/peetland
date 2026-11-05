import { plan, planNames } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { PlaceType } from '@peetland/places';
import { createMockedPlaces } from '@peetland/places/dev';
import { describe, expect, it, vi } from 'vitest';

import { createCollectBottlesTask, createPlacesWithTrashBins } from '../../dev';
import { MAX_BOTTLES } from '../../src/constants';

describe('CollectBottlesTask', () => {
  describe('Метод search-random-trash-bin', () => {
    describe('Предусловия', () => {
      it('Если NPC унесёт ещё бутылку и мусорки есть, план составляется', () => {
        const task = createCollectBottlesTask(createPlacesWithTrashBins());
        const state = new NpcStateBuilder()
          .withInventory({ [Item.Bottles]: MAX_BOTTLES - 1 })
          .build();

        expect(planNames(task, state)).not.toBeNull();
      });

      it('Если у NPC MAX_BOTTLES бутылок, план не составляется', () => {
        const task = createCollectBottlesTask(createPlacesWithTrashBins());
        const state = new NpcStateBuilder().withInventory({ [Item.Bottles]: MAX_BOTTLES }).build();

        expect(planNames(task, state)).toBeNull();
      });

      it('Если мусорок нет, план не составляется', () => {
        const places = createMockedPlaces({ ofType: vi.fn(() => []) });

        expect(planNames(createCollectBottlesTask(places), NpcStateBuilder.default())).toBeNull();
      });

      it('Ищет мусорки среди мест типа PlaceType.TrashBin', () => {
        const places = createMockedPlaces();

        plan(createCollectBottlesTask(places), NpcStateBuilder.default());

        expect(places.ofType).toHaveBeenCalledWith(PlaceType.TrashBin);
      });
    });
  });
});
