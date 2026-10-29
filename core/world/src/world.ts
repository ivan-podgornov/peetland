import type { IGame } from '@peetland/game';
import type { Vector3 } from '@peetland/geometry';

export type WorldDeps = {
  game: IGame;
};

export class World {
  private readonly game: IGame;

  constructor(deps: WorldDeps) {
    this.game = deps.game;
  }

  /** Запускает жизнедеятельность мира */
  bigBang() {
    const actor = this.game.actorFactory.create({
      modelId: 230, // Бомж в капюшончике
      position: { x: 2269.6, y: 65.66, z: 26.48 }, // Подворотня в Palomino Creek
    });

    const trashBeen: Vector3 = { x: 2320.08, y: 14.22, z: 26.48 }; // Мусорка в Palomino Creek
    actor.goToCoords(trashBeen, 0.5).subscribe({
      complete: () => {
        actor.playAnimation('trash-search', 100000).subscribe();
      },
    });
  }
}
