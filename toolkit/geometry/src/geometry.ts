import type { IGeometry, Sector2d, Vector2, Vector3 } from './types';

export class Geometry implements IGeometry {
  /** Полный оборот в градусах */
  private static readonly FULL_TURN = 360;

  /** Создаёт точку на плоскости */
  static vector2(x: number, y: number): Vector2 {
    return {
      x,
      y,
    };
  }

  /** Создаёт точку в пространстве */
  static vector3(x: number, y: number, z: number): Vector3 {
    return {
      x,
      y,
      z,
    };
  }

  /** Создаёт круговой сектор на плоскости */
  static sector2d(origin: Vector2, angle: number, fovDeg: number): Sector2d {
    return {
      origin,
      angle,
      fovDeg,
    };
  }

  getDistance2d(pointA: Vector2, pointB: Vector2): number {
    const x = Math.pow(pointB.x - pointA.x, 2);
    const y = Math.pow(pointB.y - pointA.y, 2);

    return Math.sqrt(x + y);
  }

  getDistance3d(pointA: Vector3, pointB: Vector3): number {
    const x = Math.pow(pointB.x - pointA.x, 2);
    const y = Math.pow(pointB.y - pointA.y, 2);
    const z = Math.pow(pointB.z - pointA.z, 2);

    return Math.sqrt(x + y + z);
  }

  isWithinRadius2d(point: Vector2, center: Vector2, radius: number): boolean {
    return this.getDistance2d(point, center) <= radius;
  }

  isWithinRadius3d(point: Vector3, center: Vector3, radius: number): boolean {
    return this.getDistance3d(point, center) <= radius;
  }

  moveTowards(current: Vector3, target: Vector3, maxDistance: number): Vector3 {
    const dx = target.x - current.x;
    const dy = target.y - current.y;
    const dz = target.z - current.z;
    const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2));

    if (distance <= maxDistance || distance === 0) {
      return { ...target };
    }

    const ratio = maxDistance / distance;

    return {
      x: current.x + dx * ratio,
      y: current.y + dy * ratio,
      z: current.z + dz * ratio,
    };
  }

  isWithinAngle(angle: number, target: number, tolerance = 0): boolean {
    const difference = this.normalizeAngle(angle - target);
    const shortestDifference = Math.min(difference, Geometry.FULL_TURN - difference);

    return shortestDifference <= tolerance;
  }

  getAngleTo(from: Vector2, to: Vector2): number {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const angle = (Math.atan2(-dx, dy) * 180) / Math.PI;

    return this.normalizeAngle(angle);
  }

  formatPoint(point: Vector3): string {
    return `${point.x.toFixed(2)}, ${point.y.toFixed(2)}, ${point.z.toFixed(2)}`;
  }

  normalizeAngle(angle: number): number {
    const { FULL_TURN } = Geometry;

    return ((angle % FULL_TURN) + FULL_TURN) % FULL_TURN;
  }

  isPointInSector2d(sector: Sector2d, point: Vector2): boolean {
    if (sector.fovDeg >= 360) {
      return true;
    }

    const isVertex = point.x === sector.origin.x && point.y === sector.origin.y;

    if (isVertex) {
      return true;
    }

    const angleToPoint = this.getAngleTo(sector.origin, point);

    return this.isWithinAngle(angleToPoint, sector.angle, sector.fovDeg / 2);
  }
}
