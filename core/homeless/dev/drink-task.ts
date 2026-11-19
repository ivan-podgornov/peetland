import type { PlanStructureBuilder } from '@peetland/htn/dev';
import type { INpcTaskFactory } from '@peetland/npc-tasks';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { PlaceType } from '@peetland/places';
import type { IPlaces } from '@peetland/places';
import { createMockedPlaces } from '@peetland/places/dev';
import { createPlace } from '@peetland/places/dev';
import { vi } from 'vitest';

import { DrinkTask } from '../src/drink-task';

/**
 * Добавляет в структуру плана задачу «выпить» из фабрики примитивов: выпить стоя, отдать пойло,
 * получить пустую бутылку и сообщить зависимостям
 */
export function buildDrinkBooze(structure: PlanStructureBuilder): PlanStructureBuilder {
  return structure.transaction('drink', 'drink-booze', (drink) =>
    drink
      .primitive('play-animation')
      .primitive('remove-item')
      .primitive('add-item')
      .primitive('addictions-consume')
  );
}

/** Создаёт задачу «бухать» с настоящей фабрикой примитивов, если другая не передана */
export function createDrinkTask(
  places: IPlaces,
  npcTaskFactory: INpcTaskFactory = createNpcTaskFactory()
): DrinkTask {
  return new DrinkTask({
    npcTaskFactory,
    places,
  });
}

/** Создаёт мок мест, в которых есть бомжарня. NPC в ней, если inCamp */
export function createPlacesWithCamp(
  inCamp: boolean,
  camp = createPlace({ type: PlaceType.HomelessCamp })
) {
  return createMockedPlaces({
    ofType: vi.fn(() => [camp]),
    findNearest: vi.fn(() => camp),
    isNear: vi.fn(() => inCamp),
  });
}
