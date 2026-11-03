import { Geometry } from '@peetland/geometry';

import type { PlaceData } from '../src';
import { Places } from '../src/places';

/** Создаёт места с настоящей геометрией */
export function createPlaces(places: readonly PlaceData[]): Places {
  return new Places({ places }, { geometry: new Geometry() });
}
