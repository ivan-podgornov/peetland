import type { IVisionSystem, VisionSystemDeps } from './vision-system';
import { VisionSystem } from './vision-system';

/** Фабрика системы зрения */
export interface IVisionSystemFactory {
  /** Создаёт систему зрения */
  create(deps: VisionSystemDeps): IVisionSystem;
}

export class VisionSystemFactory implements IVisionSystemFactory {
  create(deps: VisionSystemDeps): IVisionSystem {
    return new VisionSystem(deps);
  }
}
