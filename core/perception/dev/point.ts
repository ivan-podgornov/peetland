import type { Vector3 } from '@peetland/geometry';

/** Возвращает точку на расстоянии distance от начала координат: 0° — север, против часовой стрелки */
export function getPointAt(bearing: number, distance: number): Vector3 {
  const radians = (bearing * Math.PI) / 180;

  return {
    x: -distance * Math.sin(radians),
    y: distance * Math.cos(radians),
    z: 0,
  };
}
