import type { IGame } from '@peetland/game';

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

    // Мусорка в Palomino Creek: где встать и куда смотреть, чтобы быть лицом к ней
    const trashBin = { position: { x: 2320.08, y: 14.22, z: 26.48 }, angle: 276.6 };
    actor
      .goToCoords(trashBin.position, 0.5)
      .execute()
      .subscribe({
        complete: () => {
          // Пока поворачиваем сразу, без achieveAngle: так проще проверить в игре, что угол
          // к мусорке правильный
          actor.setAngle(trashBin.angle);
          actor.playAnimation('trash-search', 100000).execute().subscribe();
        },
      });
  }
}
