import type { IActorState } from '../types';

export class SpawnedActorState implements IActorState {
  throwIfDespawned(): void {
    return;
  }
}
