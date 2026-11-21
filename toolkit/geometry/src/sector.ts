import { Geometry } from './geometry';

import type { Vector2 } from './types';

/** Общие вычисления углов. Класс без состояния, поэтому один экземпляр на модуль */
const geometry = new Geometry();

/** Круговой сектор на плоскости */
export type Sector2d = {
  /** Вершина сектора */
  origin: Vector2;
  /** Направление центра сектора в градусах: 0° — север (+Y), угол растёт против часовой стрелки */
  angle: number;
  /** Угловой размер сектора в градусах. 360 и больше — всё вокруг */
  fovDeg: number;
};

/** Проверяет, что точка находится в круговом секторе, включая его границы. Радиус не проверяется */
export function isPointInSector2d(sector: Sector2d, point: Vector2): boolean {
  if (sector.fovDeg >= 360) {
    return true;
  }

  const isVertex = point.x === sector.origin.x && point.y === sector.origin.y;

  if (isVertex) {
    return true;
  }

  const angleToPoint = geometry.getAngleTo(sector.origin, point);

  return geometry.isWithinAngle(angleToPoint, sector.angle, sector.fovDeg / 2);
}
