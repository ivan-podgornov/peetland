import { PlaceType } from '../src';
import type { IPlaces } from '../src';

import { createPlaces } from './create-places';
import { createPlace } from './places';

/** Магазин для тестов: в начале координат, прилавком на 90 градусов */
export const TEST_SHOP = createPlace({
  id: 'shop',
  type: PlaceType.Shop,
  angle: 90,
});

/** Бомжарня для тестов: в 10 метрах от магазина по оси x */
export const TEST_CAMP = createPlace({
  id: 'camp',
  type: PlaceType.HomelessCamp,
  position: {
    x: 10,
    y: 0,
    z: 0,
  },
});

/** Место для распития для тестов: в 10 метрах от магазина по оси x */
export const TEST_SPOT = createPlace({
  id: 'spot',
  type: PlaceType.DrinkingSpot,
  position: {
    x: 10,
    y: 0,
    z: 0,
  },
});

/** Создаёт места с магазином TEST_SHOP и бомжарней TEST_CAMP */
export function createPlacesWithShopAndCamp(): IPlaces {
  return createPlaces([TEST_SHOP, TEST_CAMP]);
}

/** Создаёт места с магазином TEST_SHOP и местом для распития TEST_SPOT */
export function createPlacesWithShopAndSpot(): IPlaces {
  return createPlaces([TEST_SHOP, TEST_SPOT]);
}
