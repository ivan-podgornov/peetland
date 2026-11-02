import type { IGame } from '@peetland/game';
import { HTNFactory } from '@peetland/htn';
import type { IHTNFactory } from '@peetland/htn';
import { InventoryFactory } from '@peetland/inventory';
import type { IInventoryFactory } from '@peetland/inventory';
import { NpcFactory } from '@peetland/npc';
import type { INpcFactory, IRootTaskFactory, NpcContext, NpcData, NpcState } from '@peetland/npc';
import { PlacesFactory } from '@peetland/places';
import type { IPlacesFactory, PlaceData } from '@peetland/places';
import { ConscientiousnessFactory, LuckFactory, PsycheFactory, Trait } from '@peetland/psyche';
import type { IPsycheFactory } from '@peetland/psyche';
import { Random } from '@peetland/random';
import type { IRandom } from '@peetland/random';
import type { IRepository } from '@peetland/repository';
import { Timer } from '@peetland/timings';
import type { ITimer } from '@peetland/timings';

import { RootTaskFactory } from './root-task-factory';

export type WorldOptions = {
  /** Игра, в которой живёт мир */
  game: IGame;
  /** Места мира */
  places: IRepository<PlaceData>;
  /** NPC, которые живут в мире */
  npcs: IRepository<NpcData>;
};

/**
 * Зависимости мира. Мир собирает их сам, а переданные заменяют собранные по умолчанию. Зависимости
 * по умолчанию собираются из других зависимостей, в том числе переданных
 */
export type WorldDeps = {
  random: IRandom;
  timer: ITimer;
  /** Фабрика, которой NPC создают своих HTN-агентов */
  htnFactory: IHTNFactory<NpcState, NpcContext>;
  /** Фабрика, которой NPC создают свои инвентари */
  inventoryFactory: IInventoryFactory;
  /** Фабрика, которой NPC создают свои психики, а задачи предсказывают реакцию психики */
  psycheFactory: IPsycheFactory;
  /** Фабрика, которой мир создаёт запросы к загруженным местам */
  placesFactory: IPlacesFactory;
  /** Фабрика, которой NPC создают корневые задачи по своему типу */
  rootTaskFactory: IRootTaskFactory;
  /** Фабрика, которой мир создаёт NPC */
  npcFactory: INpcFactory;
};

export class World {
  private readonly options: WorldOptions;
  private readonly deps: Partial<WorldDeps>;

  constructor(options: WorldOptions, deps: Partial<WorldDeps> = {}) {
    this.options = options;
    this.deps = deps;
  }

  /**
   * Запускает жизнедеятельность мира: загружает места, собирает зависимости и на каждую запись из
   * репозитория NPC создаёт NPC
   */
  async bigBang(): Promise<void> {
    const { game, npcs, places } = this.options;
    const { actorFactory, frames, geometry } = game;
    const {
      random = new Random(),
      timer = new Timer(),
      htnFactory = new HTNFactory<NpcState, NpcContext>(),
      inventoryFactory = new InventoryFactory(),
      psycheFactory = new PsycheFactory({
        traitFactories: {
          [Trait.Conscientiousness]: new ConscientiousnessFactory(),
          [Trait.Luck]: new LuckFactory(),
        },
      }),
      placesFactory = new PlacesFactory({ geometry }),
    } = this.deps;
    const worldPlaces = placesFactory.create({ places: await places.getAll() });
    const {
      rootTaskFactory = new RootTaskFactory({
        geometry,
        places: worldPlaces,
        psycheFactory,
        random,
        timer,
      }),
      npcFactory = new NpcFactory({
        actorFactory,
        frames,
        htnFactory,
        inventoryFactory,
        psycheFactory,
        rootTaskFactory,
      }),
    } = this.deps;

    for (const data of await npcs.getAll()) {
      npcFactory.create(data);
    }
  }
}
