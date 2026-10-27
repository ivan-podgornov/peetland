import type { IActorState } from '../types';

/** Состояние деспавненного актора: любой его метод выбрасывает ошибку */
export class DespawnedActorState implements IActorState {
  getPosition(): never {
    throw this.createError();
  }

  setPosition(): never {
    throw this.createError();
  }

  createGoToCoordsCommand(): never {
    throw this.createError();
  }

  despawn(): never {
    throw this.createError();
  }

  private createError(): Error {
    return new Error('Актор деспавнен');
  }
}
