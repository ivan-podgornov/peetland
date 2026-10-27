import type { Observable } from '@peetland/events';
import type { Vector3 } from '@peetland/geometry';

import { DespawnedActorState } from './states/despawned';
import type { IActor, IActorCommand, IActorState } from './types';

/**
 * Актор делегирует все методы состоянию: при спавне это состояние, переданное в конструктор,
 * а после деспавна — DespawnedActorState
 */
export class Actor implements IActor {
  private state: IActorState;

  constructor(state: IActorState) {
    this.state = state;
  }

  /** Команда, которую актор выполняет сейчас */
  get currentCommand(): IActorCommand | null {
    return this.state.currentCommand;
  }

  getPosition(): Vector3 {
    return this.state.getPosition();
  }

  setPosition(position: Vector3): void {
    this.state.setPosition(position);
  }

  goToCoords(coords: Vector3, completeRadius: number): Observable<Vector3> {
    return this.state.goToCoords(coords, completeRadius);
  }

  despawn(): void {
    this.state.despawn();
    this.state = new DespawnedActorState();
  }
}
