import type { INpcFactory, NpcData } from '@peetland/npc';
import type { IRepository } from '@peetland/repository';

export type WorldDeps = {
  /** NPC, которые живут в мире */
  npcs: IRepository<NpcData>;
  /** Фабрика, которой мир создаёт NPC */
  npcFactory: INpcFactory;
};

export class World {
  private readonly deps: WorldDeps;

  constructor(deps: WorldDeps) {
    this.deps = deps;
  }

  /** Запускает жизнедеятельность мира: на каждую запись из репозитория NPC создаёт NPC */
  async bigBang(): Promise<void> {
    const { npcs, npcFactory } = this.deps;
    const npcsData = await npcs.getAll();

    for (const data of npcsData) {
      npcFactory.create(data);
    }
  }
}
