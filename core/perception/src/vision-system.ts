import type { IActor, IActorRegistry } from '@peetland/game';
import { Geometry } from '@peetland/geometry';
import type { IGeometry, Vector3 } from '@peetland/geometry';

import type { ILosProvider } from './los-provider';

/** Человеческий угол зрения в градусах */
export const HUMAN_FOV_DEG = 100;

export type VisionSystemDeps = {
  /** Реестр акторов, среди которых ищутся видимые */
  registry: IActorRegistry;
  /** Провайдер прямой видимости */
  los: ILosProvider;
  geometry: IGeometry;
};

/** Система зрения: сообщает, каких акторов видит данный актор */
export interface IVisionSystem {
  /** Возвращает акторов, которых видит target в радиусе radius */
  getVisibleActors(target: IActor, radius: number): IActor[];
}

export class VisionSystem implements IVisionSystem {
  private readonly deps: VisionSystemDeps;

  constructor(deps: VisionSystemDeps) {
    this.deps = deps;
  }

  /** Возвращает акторов, которых видит target в радиусе radius */
  getVisibleActors(target: IActor, radius: number): IActor[] {
    const { registry } = this.deps;
    const position = target.getPosition();

    return registry.getAll().filter((actor) => this.isVisible(target, actor, position, radius));
  }

  private isVisible(
    target: IActor,
    actor: IActor,
    targetPosition: Vector3,
    radius: number
  ): boolean {
    if (actor === target || actor.signal.aborted) {
      return false;
    }

    const { geometry, los } = this.deps;
    const actorPosition = actor.getPosition();

    if (!geometry.isWithinRadius2d(actorPosition, targetPosition, radius)) {
      return false;
    }

    if (
      !geometry.isPointInSector2d(
        Geometry.sector2d(targetPosition, target.getAngle(), HUMAN_FOV_DEG),
        actorPosition
      )
    ) {
      return false;
    }

    return los.isLineOfSightClear(targetPosition, actorPosition);
  }
}
