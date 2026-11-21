import type { Vector3 } from '@peetland/geometry';

/** Провайдер прямой видимости: знает, свободна ли прямая между двумя точками мира */
export interface ILosProvider {
  /**
   * Проверяет, свободна ли прямая от `from` до `to`: нет ли между точками стены или другого
   * препятствия
   */
  isLineOfSightClear(from: Vector3, to: Vector3): boolean;
}
