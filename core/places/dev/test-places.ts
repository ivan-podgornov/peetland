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

/** Место для трапезы для тестов: в 10 метрах от магазина по оси x */
export const TEST_MEAL_SPOT = createPlace({
  id: 'meal-spot',
  type: PlaceType.MealSpot,
  position: {
    x: 10,
    y: 0,
    z: 0,
  },
});

/** Создаёт места с магазином TEST_SHOP и местом для трапезы TEST_MEAL_SPOT */
export function createPlacesWithShopAndMealSpot(): IPlaces {
  return createPlaces([TEST_SHOP, TEST_MEAL_SPOT]);
}
