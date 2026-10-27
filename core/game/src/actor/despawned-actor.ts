import type { IActor } from './types';

/** Деспавненный актор: любой его метод выбрасывает ошибку */
export class DespawnedActor implements IActor {
  readonly currentCommand = null;

  getPosition(): never {
    throw this.createError();
  }

  setPosition(): never {
    throw this.createError();
  }

  goToCoords(): never {
    throw this.createError();
  }

  despawn(): never {
    throw this.createError();
  }

  private createError(): Error {
    return new Error('Актор деспавнен');
  }
}
