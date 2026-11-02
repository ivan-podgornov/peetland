import { Geometry } from '@peetland/geometry';

import { Places } from '../src';
import type { PlaceData } from '../src';

/** Создаёт места с настоящей геометрией */
export function createPlaces(places: readonly PlaceData[]): Places {
  return new Places({ places }, { geometry: new Geometry() });
}
