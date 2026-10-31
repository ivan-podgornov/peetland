import type { IGame } from '@peetland/game';
import type { Vector3 } from '@peetland/geometry';

/** Насколько актор может быть отвёрнут от мусорки, чтобы в ней рыться, в градусах */
const TRASH_FACING_TOLERANCE = 5;

export type WorldDeps = {
  game: IGame;
};

export class World {
  private readonly deps: WorldDeps;

  constructor(deps: WorldDeps) {
    this.deps = deps;
  }

  /** Запускает жизнедеятельность мира */
  bigBang() {
    const { game } = this.deps;
    const actor = game.actorFactory.create({
      modelId: 230, // Бомж в капюшончике
      position: { x: 2269.6, y: 65.66, z: 26.48 }, // Подворотня в Palomino Creek
      angle: 0,
    });

    const trashBeen: Vector3 = { x: 2320.08, y: 14.22, z: 26.48 }; // Мусорка в Palomino Creek
    actor
      .goToCoords(trashBeen, 0.5)
      .execute()
      .subscribe({
        complete: () => {
          const angle = game.geometry.getAngleTo(actor.getPosition(), trashBeen);

          actor
            .achieveAngle(angle, TRASH_FACING_TOLERANCE)
            .execute()
            .subscribe({
              complete: () => {
                actor.playAnimation('trash-search', 100000).execute().subscribe();
              },
            });
        },
      });
  }
}
