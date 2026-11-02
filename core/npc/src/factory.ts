import type { NpcData } from './data';
import { Npc } from './npc';
import type { NpcDeps } from './npc';

export interface INpcFactory {
  /** Создаёт NPC по данным */
  create(data: NpcData): Npc;
}

export class NpcFactory implements INpcFactory {
  private readonly deps: NpcDeps;

  constructor(deps: NpcDeps) {
    this.deps = deps;
  }

  create(data: NpcData): Npc {
    return new Npc(data, this.deps);
  }
}
