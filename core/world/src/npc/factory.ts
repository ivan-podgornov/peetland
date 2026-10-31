import type { Observable } from '@peetland/events';
import type { IActorFactory } from '@peetland/game';
import type { IHTNFactory } from '@peetland/htn';

import type { NpcData } from './data';
import { Npc } from './npc';
import type { INpcRootTaskFactory } from './root-task';
import type { NpcState } from './state';

export type NpcFactoryDeps = {
  /** Фабрика, которой NPC создают своих акторов */
  actorFactory: IActorFactory;
  /** Фабрика, которой NPC создают своих HTN-агентов */
  htnFactory: IHTNFactory<NpcState>;
  /** Фабрика корневой задачи NPC */
  rootTaskFactory: INpcRootTaskFactory;
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
