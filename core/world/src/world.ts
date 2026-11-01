import type { Observable } from '@peetland/events';
import type { IGame } from '@peetland/game';
import { HTNFactory } from '@peetland/htn';
import type { IRepository } from '@peetland/repository';

import { NpcFactory } from './npc';
import type { Npc, NpcContext, NpcData, NpcState } from './npc';
import type { PlaceData } from './places';
import { RootTask, TaskFactory } from './tasks';

export type WorldDeps = {
  game: IGame;
  /** NPC, которые живут в мире */
  npcs: IRepository<NpcData>;
  /** Места мира, которыми пользуются NPC */
  places: IRepository<PlaceData>;
  /** Сообщает о каждом кадре игры */
  frames: Observable<unknown>;
};

export class World {
  private readonly deps: WorldDeps;

  constructor(deps: WorldDeps) {
    this.deps = deps;
  }

  /**
   * Запускает жизнедеятельность мира: на каждую запись из репозитория NPC создаёт NPC, который
   * живёт среди мест из репозитория мест
   * @returns промис с созданными NPC
   */
  async bigBang(): Promise<Npc[]> {
    const { game, npcs, places, frames } = this.deps;
    const [npcsData, placesData] = await Promise.all([npcs.getAll(), places.getAll()]);
    const { geometry } = game;
    const taskFactory = new TaskFactory({ geometry });
    const npcFactory = new NpcFactory({
      actorFactory: game.actorFactory,
      htnFactory: new HTNFactory<NpcState, NpcContext>(),
      rootTask: new RootTask({ places: placesData }, { geometry, taskFactory }),
      frames,
    });

    return npcsData.map((data) => npcFactory.create(data));
  }
}
