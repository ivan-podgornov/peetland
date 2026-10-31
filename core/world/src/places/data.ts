import type { Vector3 } from '@peetland/geometry';

export enum PlaceType {
  HomelessCamp = 'homeless-camp',
  Shop = 'shop',
  BottleCollection = 'bottle-collection',
  TrashBin = 'trash-bin',
  BeggingSpot = 'begging-spot',
}

/** Данные места, которые хранятся в репозитории */
export type PlaceData = Readonly<{
  id: string;
  type: PlaceType;
  /** Координаты места: где нужно встать, чтобы им воспользоваться */
  position: Vector3;
  /**
   * Угол поворота в градусах, на который нужно повернуться, стоя в position, например, чтобы
   * оказаться лицом к мусорке
   */
  angle: number;
}>;
