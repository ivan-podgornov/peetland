import type { Vector3 } from '@peetland/geometry';

export enum PlaceType {
  Shop = 'shop',
  BottleCollection = 'bottle-collection',
  TrashBin = 'trash-bin',
  BeggingSpot = 'begging-spot',
}

/** Данные места, которые хранятся в репозитории */
export type PlaceData = Readonly<{
  id: string;
  type: PlaceType;
  /** Координаты места */
  position: Vector3;
}>;
