import type { INpcTaskFactory } from '@peetland/npc-tasks';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { PlaceType } from '@peetland/places';
import type { IPlaces } from '@peetland/places';
import { createMockedPlaces } from '@peetland/places/dev';
import { createPlace } from '@peetland/places/dev';
import { vi } from 'vitest';

import { BOOZE_PRICE, BOTTLE_PRICE } from '../src/constants';
import { SellBottlesTask } from '../src/sell-bottles-task';

/** Создаёт задачу сдачи бутылок с настоящей фабрикой примитивов, если другая не передана */
export function createSellBottlesTask(
  places: IPlaces,
  npcTaskFactory: INpcTaskFactory = createNpcTaskFactory()
): SellBottlesTask {
  return new SellBottlesTask({
    npcTaskFactory,
    places,
  });
}

/** Создаёт мок мест, в которых есть переданная приёмка, и она же ближайшая */
export function createPlacesWithCollection(
  collection = createPlace({ type: PlaceType.BottleCollection })
) {
  return createMockedPlaces({
    ofType: vi.fn(() => [collection]),
    findNearest: vi.fn(() => collection),
  });
}

/** Сколько бутылок нужно сдать, чтобы хватило на пойло, если денег нет */
export const BOTTLES_FOR_BOOZE = BOOZE_PRICE / BOTTLE_PRICE;
