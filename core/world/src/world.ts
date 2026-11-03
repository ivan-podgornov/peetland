import type { IGame } from '@peetland/game';
import { NpcFactory } from '@peetland/npc';
import type { INpcFactory, INpcWorldKnowledge, IRootTaskFactory, NpcData } from '@peetland/npc';
import { PlacesFactory } from '@peetland/places';
import type { IPlacesFactory, PlaceData } from '@peetland/places';
import { PsycheFactory } from '@peetland/psyche';
import type { IPsycheFactory } from '@peetland/psyche';
import { Random } from '@peetland/random';
import type { IRandom } from '@peetland/random';
import type { IRepository } from '@peetland/repository';
import { Timer } from '@peetland/timings';
import type { ITimer } from '@peetland/timings';

import { NpcWorldKnowledge } from './npc-world-knowledge';
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
  /**
   * Фабрика, которой задачи предсказывают реакцию психики, а NPC создают свои психики. Одна на
   * всех, чтобы задачи предсказывали реакцию такой же психики, как у NPC
   */
  psycheFactory: IPsycheFactory;
  /** Фабрика, которой мир создаёт запросы к загруженным местам */
  placesFactory: IPlacesFactory;
  /** Фабрика, которой NPC создают корневые задачи по своему типу */
  rootTaskFactory: IRootTaskFactory;
  /** То, что NPC знают о мире. Одно на всех, потому что все NPC знают о мире одно и то же */
  worldKnowledge: INpcWorldKnowledge;
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
    const { actorFactory, time, frames, geometry, signal } = game;
    const {
      random = new Random(),
      timer = new Timer(),
      psycheFactory = new PsycheFactory(),
      placesFactory = new PlacesFactory({ geometry }),
      worldKnowledge = new NpcWorldKnowledge({ time }),
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
        psycheFactory,
        rootTaskFactory,
        signal,
        worldKnowledge,
      }),
    } = this.deps;

    for (const data of await npcs.getAll()) {
      npcFactory.create(data);
    }
  }
}
