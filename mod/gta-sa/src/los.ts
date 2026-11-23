import type { Vector3 } from '@peetland/geometry';
import { isLineOfSightClear } from '@peetland/moonloader';
import type { ILosProvider } from '@peetland/perception';

/**
 * Провайдер прямой видимости GTA SA: проверяет прямую нативом MoonLoader
 */
export class GtaLosProvider implements ILosProvider {
  isLineOfSightClear(from: Vector3, to: Vector3): boolean {
    // Стены и объекты карты перекрывают зрение, машины и персонажи нет — иначе в толпе NPC слепнут
    // друг о друге
    return isLineOfSightClear(
      from.x,
      from.y,
      from.z,
      to.x,
      to.y,
      to.z,
      true, // checkBuildings
      false, // checkCars
      false, // checkOther
      false, // checkPeds
      true, // checkObjects
      false, // seeThroughStuff
      false // ignoreSomeObjectsForCamera
    );
  }
}
