import type { IGeometry, Vector3 } from '@peetland/geometry';

import type { PlaceData, PlaceType } from './data';

/** Запросы к местам мира. Места уже загружены, поэтому запросы синхронные */
export interface IPlaces {
  /** Возвращает места типа */
  ofType(type: PlaceType): readonly PlaceData[];

  /**
   * Возвращает место типа, ближайшее к позиции. Если ближайших несколько, возвращает первое из них.
   * Если мест такого типа нет, возвращает undefined
   */
  findNearest(position: Vector3, type: PlaceType): PlaceData | undefined;

  /** Проверяет, есть ли место типа не дальше радиуса от позиции */
  isNear(position: Vector3, type: PlaceType, radius: number): boolean;
}

export type PlacesOptions = {
  /** Загруженные места мира */
  places: readonly PlaceData[];
};

export type PlacesDeps = {
  geometry: IGeometry;
};

export class Places implements IPlaces {
  private readonly places: readonly PlaceData[];
  private readonly deps: PlacesDeps;

  constructor(options: PlacesOptions, deps: PlacesDeps) {
    this.places = options.places;
    this.deps = deps;
  }

  ofType(type: PlaceType): readonly PlaceData[] {
    return this.places.filter((place) => place.type === type);
  }

  findNearest(position: Vector3, type: PlaceType): PlaceData | undefined {
    const { geometry } = this.deps;
    const [first, ...rest] = this.ofType(type);

    if (!first) {
      return undefined;
    }

    return rest.reduce((nearest, place) => {
      const distance = geometry.getDistance3d(position, place.position);
      const nearestDistance = geometry.getDistance3d(position, nearest.position);

      return distance < nearestDistance ? place : nearest;
    }, first);
  }

  isNear(position: Vector3, type: PlaceType, radius: number): boolean {
    const { geometry } = this.deps;

    return this.ofType(type).some((place) =>
      geometry.isWithinRadius3d(position, place.position, radius)
    );
  }
}
