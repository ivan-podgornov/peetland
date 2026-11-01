import { Geometry } from '@peetland/geometry';
import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import { Places } from '../../src';
import type { IPlaces, PlaceData } from '../../src';

/** Создаёт места с настоящей геометрией */
export function createPlaces(places: readonly PlaceData[]): Places {
  return new Places({ places }, { geometry: new Geometry() });
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
