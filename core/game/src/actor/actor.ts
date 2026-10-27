import { Observable } from '@peetland/events';
import type { ISubscriber } from '@peetland/events';
import type { Vector3 } from '@peetland/geometry';

import { DespawnedActorState } from './states/despawned';
import type { IActor, IActorCommand, IActorState } from './types';

/**
 * Актор, который выполняет одну команду за раз. Всё остальное делегирует состоянию: при спавне
 * это состояние, переданное в конструктор, а после деспавна — DespawnedActorState
 */
export class Actor implements IActor {
  private state: IActorState;
  private command: IActorCommand | null;

  constructor(state: IActorState) {
    this.state = state;
    this.command = null;
  }

  /** Команда, которую актор выполняет сейчас */
  get currentCommand(): IActorCommand | null {
    return this.command;
  }

  getPosition(): Vector3 {
    return this.state.getPosition();
  }

  setPosition(position: Vector3): void {
    this.state.setPosition(position);
  }

  goToCoords(coords: Vector3, completeRadius: number): Observable<Vector3> {
    return new Observable((subscriber: ISubscriber<Vector3>) => {
      const command = this.state.createGoToCoordsCommand(this, subscriber, {
        coords,
        completeRadius,
      });

      this.runCommand(subscriber, command);
    });
  }

  despawn(): void {
    this.command?.cancel(new Error('Актор деспавнен'));
    this.state.despawn();
    this.state = new DespawnedActorState();
  }

  /** Прерывает текущую команду и начинает выполнять новую */
  private runCommand<T>(subscriber: ISubscriber<T>, command: IActorCommand): void {
    this.command?.cancel(new Error('Актор получил другую команду'));
    this.command = command;

    subscriber.addTeardown(() => {
      if (this.command === command) {
        this.command = null;
      }
    });

    command.start();
  }
}
