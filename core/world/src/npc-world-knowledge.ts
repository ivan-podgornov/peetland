import type { IActor, IGame } from '@peetland/game';
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
  private readonly actor: IActor;
  private readonly deps: NpcWorldKnowledgeDeps;

  constructor(actor: IActor, deps: NpcWorldKnowledgeDeps) {
    this.actor = actor;
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

    return game
      .getVisibleActors(this.actor, radius)
      .map((visibleActor) => actorNpcRegistry.getNpc(visibleActor));
  }
}

/** Создаёт знание о мире для каждого NPC: знание замыкает тело NPC, для которого создано */
export class NpcWorldKnowledgeFactory implements INpcWorldKnowledgeFactory {
  private readonly deps: NpcWorldKnowledgeDeps;

  constructor(deps: NpcWorldKnowledgeDeps) {
    this.deps = deps;
  }

  /** Создаёт знание о мире для тела NPC */
  create(actor: IActor): INpcWorldKnowledge {
    return new NpcWorldKnowledge(actor, this.deps);
  }
}
