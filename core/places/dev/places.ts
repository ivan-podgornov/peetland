import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import { PlaceType } from '../src';
import type { IPlaces, PlaceData } from '../src';

/** Создаёт место. Поля, которые не переданы, заполняются незначимыми значениями */
export function createPlace(place: Partial<PlaceData> = {}): PlaceData {
  return {
    id: 'shop',
    type: PlaceType.Shop,
    position: {
      x: 0,
      y: 0,
      z: 0,
    },
    angle: 0,
    ...place,
  };
}

/**
 * Создаёт мок запросов к местам. Методы, которые не переданы, отвечают, что мест нет: ofType
 * возвращает пустой список, findNearest — undefined, isNear — false
 */
export function createMockedPlaces(places: Partial<IPlaces> = {}): Mocked<IPlaces> {
  return {
    ofType: vi.fn(() => []),
    findNearest: vi.fn(() => undefined),
    isNear: vi.fn(() => false),
    ...places,
  } as Mocked<IPlaces>;
}
