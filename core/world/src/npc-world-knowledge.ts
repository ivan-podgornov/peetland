import type { IGame } from '@peetland/game';
import type {
  IActorNpcRegistry,
  INpc,
  INpcWorldKnowledge,
  INpcWorldKnowledgeFactory,
} from '@peetland/npc';
import type { IReadonlyTime } from '@peetland/timings';

export type NpcWorldKnowledgeDeps = {
  /** Время суток, которое знают NPC */
  time: IReadonlyTime;
  /** Игра, у которой знание спрашивает видимых акторов */
  game: IGame;
  /** Реестр, в котором NPC связывают своих акторов с собой */
  actorNpcRegistry: IActorNpcRegistry;
};

/** Знание NPC о мире, которое мир собирает из своих источников для конкретного NPC */
export class NpcWorldKnowledge implements INpcWorldKnowledge {
  private readonly npc: INpc;
  private readonly deps: NpcWorldKnowledgeDeps;

  constructor(npc: INpc, deps: NpcWorldKnowledgeDeps) {
    this.npc = npc;
    this.deps = deps;
  }

  /** Возвращает время суток, которое знают NPC */
  get time(): IReadonlyTime {
    const { time } = this.deps;

    return time;
  }

  /** Возвращает NPC, которых видит NPC в радиусе radius */
  getVisibleNpcs(radius: number): INpc[] {
    const { actorNpcRegistry, game } = this.deps;
    const actor = actorNpcRegistry.getActor(this.npc);

    return game
      .getVisibleActors(actor, radius)
      .map((visibleActor) => actorNpcRegistry.getNpc(visibleActor));
  }
}

/** Создаёт знание о мире для каждого NPC: знание замыкает того NPC, для которого создано */
export class NpcWorldKnowledgeFactory implements INpcWorldKnowledgeFactory {
  private readonly deps: NpcWorldKnowledgeDeps;

  constructor(deps: NpcWorldKnowledgeDeps) {
    this.deps = deps;
  }

  /** Создаёт знание о мире для npc */
  create(npc: INpc): INpcWorldKnowledge {
    return new NpcWorldKnowledge(npc, this.deps);
  }
}
