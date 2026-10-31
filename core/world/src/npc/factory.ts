import type { Observable } from '@peetland/events';
import type { IActorFactory } from '@peetland/game';
import type { IHTNFactory, Task } from '@peetland/htn';

import type { NpcContext } from './context';
import type { NpcData } from './data';
import { Npc } from './npc';
import type { NpcState } from './state';

export type NpcFactoryDeps = {
  /** Фабрика, которой NPC создают своих акторов */
  actorFactory: IActorFactory;
  /** Фабрика, которой NPC создают своих HTN-агентов */
  htnFactory: IHTNFactory<NpcState, NpcContext>;
  /** Корневая задача NPC. Одна на всех NPC: задачи получают актора и инвентарь из контекста */
  rootTask: Task<NpcState, NpcContext>;
  /** Сообщает о каждом кадре игры */
  frames: Observable<unknown>;
};

export class NpcFactory {
  private readonly deps: NpcFactoryDeps;

  constructor(deps: NpcFactoryDeps) {
    this.deps = deps;
  }

  /** Создаёт NPC по данным */
  create(data: NpcData): Npc {
    return new Npc(data, this.deps);
  }
}
