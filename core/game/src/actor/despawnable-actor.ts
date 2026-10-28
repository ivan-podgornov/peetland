import type { Observable } from '@peetland/events';
import type { Vector3 } from '@peetland/geometry';

import type { AnimationId } from './animation';
import { DespawnedActor } from './despawned-actor';
import type { IActor, IActorCommand } from './types';

/**
 * Декоратор, который защищает актора от использования после деспавна. Передаёт вызовы обёрнутому
 * актору, а после деспавна больше его не вызывает и выбрасывает ошибку из любого метода. Поэтому
 * обёрнутый актор может рассчитывать, что despawn вызовут один раз и после него ничего вызываться
 * не будет
 */
export class DespawnableActor implements IActor {
  private actor: IActor;

  constructor(actor: IActor) {
    this.actor = actor;
  }

  get currentCommand(): IActorCommand | null {
    return this.actor.currentCommand;
  }

  getPosition(): Vector3 {
    return this.actor.getPosition();
  }

  setPosition(position: Vector3): void {
    this.actor.setPosition(position);
  }

  goToCoords(coords: Vector3, completeRadius: number): Observable<Vector3> {
    return this.actor.goToCoords(coords, completeRadius);
  }

  playAnimation(animation: AnimationId): Observable<void> {
    return this.actor.playAnimation(animation);
  }

  despawn(): void {
    this.actor.despawn();
    this.actor = new DespawnedActor();
  }
}
