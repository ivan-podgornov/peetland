import type { IVisionSystem, VisionSystemDeps } from './vision-system';
import { VisionSystem } from './vision-system';

/** Фабрика системы зрения: собирает её из зависимостей конкретной игры */
export interface IVisionSystemFactory {
  /** Создаёт систему зрения из реестра акторов, провайдера прямой видимости и геометрии */
  create(deps: VisionSystemDeps): IVisionSystem;
}

export class VisionSystemFactory implements IVisionSystemFactory {
  create(deps: VisionSystemDeps): IVisionSystem {
    return new VisionSystem(deps);
  }
}
