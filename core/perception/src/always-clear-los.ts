import type { ILosProvider } from './los-provider';

/** Провайдер прямой видимости прозрачного мира: прямая всегда свободна */
export class AlwaysClearLos implements ILosProvider {
  isLineOfSightClear(): boolean {
    return true;
  }
}
