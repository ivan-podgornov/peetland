import type { IGeometry, Vector3 } from '@peetland/geometry';

import type { PlaceData } from './data';

/**
 * Возвращает место, ближайшее к позиции. Если ближайших мест несколько, возвращает первое из них.
 * Если мест нет, возвращает undefined
 */
export function findNearestPlace(
  places: readonly PlaceData[],
  position: Vector3,
  geometry: IGeometry
): PlaceData | undefined {
  let nearest: PlaceData | undefined;
  let nearestDistance = Infinity;

  places.forEach((place) => {
    const distance = geometry.getDistance3d(position, place.position);

    if (distance < nearestDistance) {
      nearest = place;
      nearestDistance = distance;
    }
  });

  return nearest;
}
