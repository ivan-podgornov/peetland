import type { IActorState } from '../types';

export class DespawnedActorState implements IActorState {
  throwIfDespawned(): void {
    throw new Error('Актор деспавнен');
  }
}
