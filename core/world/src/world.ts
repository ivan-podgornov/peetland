import type { IRepository } from '@peetland/repository';

import type { INpcFactory, NpcData } from './npc';
import type { IPlacesFactory, PlaceData } from './places';

export type WorldDeps = {
  /** NPC, которые живут в мире */
  npcs: IRepository<NpcData>;
  /** Места мира, которыми пользуются NPC */
  places: IRepository<PlaceData>;
  /** Фабрика, которой мир создаёт запросы к загруженным местам */
  placesFactory: IPlacesFactory;
  /** Фабрика, которой мир создаёт NPC */
  npcFactory: INpcFactory;
};

export class World {
  private readonly deps: WorldDeps;

  constructor(deps: WorldDeps) {
    this.deps = deps;
  }

  /**
   * Запускает жизнедеятельность мира: на каждую запись из репозитория NPC создаёт NPC, который
   * живёт среди мест из репозитория мест
   */
  async bigBang(): Promise<void> {
    const { npcs, places, placesFactory, npcFactory } = this.deps;
    const [npcsData, placesData] = await Promise.all([npcs.getAll(), places.getAll()]);
    const loadedPlaces = placesFactory.create({ places: placesData });

    for (const data of npcsData) {
      npcFactory.create(data, { places: loadedPlaces });
    }
  }
}
