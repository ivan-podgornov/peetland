import type { IGeometry, Vector3 } from '@peetland/geometry';

import type { PlaceData } from './data';

/**
 * Возвращает место, ближайшее к позиции. Если ближайших несколько, возвращает первое из них. Если
 * мест нет, возвращает undefined
 */
export function findNearestPlace(
  places: readonly PlaceData[],
  position: Vector3,
  geometry: IGeometry
): PlaceData | undefined {
  const [first, ...rest] = places;

  if (!first) {
    return undefined;
  }

  return rest.reduce((nearest, place) => {
    const distance = geometry.getDistance3d(position, place.position);
    const nearestDistance = geometry.getDistance3d(position, nearest.position);

    return distance < nearestDistance ? place : nearest;
  }, first);
}
