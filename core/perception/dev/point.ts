import { Geometry } from '@peetland/geometry';
import type { Vector3 } from '@peetland/geometry';

/** Возвращает точку на расстоянии distance от начала координат: 0° — север, против часовой стрелки */
export function getPointAt(bearing: number, distance: number): Vector3 {
  const radians = (bearing * Math.PI) / 180;

  return Geometry.vector3(-distance * Math.sin(radians), distance * Math.cos(radians), 0);
}
