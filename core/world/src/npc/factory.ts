import type { Observable } from '@peetland/events';
import type { IActorFactory } from '@peetland/game';
import type { IHTN } from '@peetland/htn';

import type { NpcData } from './data';
import { Npc } from './npc';
import type { NpcState } from './state';

export type NpcFactoryDeps = {
  /** Фабрика, которой NPC создают своих акторов */
  actorFactory: IActorFactory;
  /** Сообщает о каждом кадре игры */
  frames: Observable<unknown>;
  /** Создаёт HTN-агента. Вызывается на каждого NPC, потому что агент хранит план своего NPC */
  createHtn: () => IHTN<NpcState>;
};

export class NpcFactory {
  private readonly deps: NpcFactoryDeps;

  constructor(deps: NpcFactoryDeps) {
    this.deps = deps;
  }

  /** Создаёт NPC по данным со своим HTN-агентом */
  create(data: NpcData): Npc {
    const { actorFactory, createHtn, frames } = this.deps;

    return new Npc(data, { actorFactory, frames, htn: createHtn() });
  }
}
