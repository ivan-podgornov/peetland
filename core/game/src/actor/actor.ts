import { Observable } from '@peetland/events';
import type { ISubscriber } from '@peetland/events';
import type { Vector3 } from '@peetland/geometry';

import { DespawnedActorState } from './states/despawned';
import { SpawnedActorState } from './states/spawned';
import type { IActor, IActorCommand, IActorState } from './types';

/**
 * Общая логика акторов: после деспавна методы выбрасывают ошибку, а актор выполняет только одну
 * команду за раз. Наследники описывают, как актор устроен на самом деле
 */
export abstract class Actor implements IActor {
  private state: IActorState;
  private currentCommand: IActorCommand | null;

  constructor() {
    this.state = new SpawnedActorState();
    this.currentCommand = null;
  }

  getPosition(): Vector3 {
    this.state.throwIfDespawned();

    return this.readPosition();
  }

  setPosition(position: Vector3): void {
    this.state.throwIfDespawned();

    this.writePosition(position);
  }

  goToCoords(coords: Vector3, completeRadius: number): Observable<Vector3> {
    this.state.throwIfDespawned();

    return new Observable((subscriber: ISubscriber<Vector3>) => {
      const command = this.createGoToCoordsCommand(subscriber, coords, completeRadius);
      this.runCommand(subscriber, command);
    });
  }

  despawn(): void {
    this.state.throwIfDespawned();

    this.state = new DespawnedActorState();
    this.currentCommand?.cancel(new Error('Актор деспавнен'));
    this.onDespawn();
  }

  /** Возвращает позицию актора */
  protected abstract readPosition(): Vector3;

  /** Переносит актора на позицию */
  protected abstract writePosition(position: Vector3): void;

  /** Создаёт команду, которая ведёт актора к точке */
  protected abstract createGoToCoordsCommand(
    subscriber: ISubscriber<Vector3>,
    coords: Vector3,
    completeRadius: number
  ): IActorCommand;

  /** Вызывается после деспавна, когда текущая команда уже прервана */
  protected onDespawn(): void {}

  /** Прерывает текущую команду и начинает выполнять новую */
  private runCommand<T>(subscriber: ISubscriber<T>, command: IActorCommand): void {
    this.currentCommand?.cancel(new Error('Актор получил другую команду'));
    this.currentCommand = command;

    subscriber.addTeardown(() => {
      if (this.currentCommand === command) {
        this.currentCommand = null;
      }
    });

    command.start();
  }
}
