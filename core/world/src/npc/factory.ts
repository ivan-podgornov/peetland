import type { Observable } from '@peetland/events';
import type { IActorFactory } from '@peetland/game';
import type { IGeometry } from '@peetland/geometry';
import type { IHTNFactory } from '@peetland/htn';

import type { PlaceData } from '../places';
import { RootTask } from '../tasks';
import type { ITaskFactory } from '../tasks';

import type { NpcContext } from './context';
import type { NpcData } from './data';
import { Npc } from './npc';
import type { NpcState } from './state';

export type CreateNpcOptions = {
  /** Места мира, которыми пользуется NPC */
  places: readonly PlaceData[];
};

export interface INpcFactory {
  /** Создаёт NPC по данным. NPC живёт среди переданных мест */
  create(data: NpcData, options: CreateNpcOptions): Npc;
}

export type NpcFactoryDeps = {
  /** Фабрика, которой NPC создают своих акторов */
  actorFactory: IActorFactory;
  /** Фабрика, которой NPC создают своих HTN-агентов */
  htnFactory: IHTNFactory<NpcState, NpcContext>;
  /** Сообщает о каждом кадре игры */
  frames: Observable<unknown>;
  geometry: IGeometry;
  /** Фабрика, которой корневая задача NPC собирает свои подзадачи */
  taskFactory: ITaskFactory;
};

export class NpcFactory implements INpcFactory {
  private readonly deps: NpcFactoryDeps;

  constructor(deps: NpcFactoryDeps) {
    this.deps = deps;
  }

  create(data: NpcData, options: CreateNpcOptions): Npc {
    const { actorFactory, htnFactory, frames, geometry, taskFactory } = this.deps;
    const rootTask = new RootTask({ places: options.places }, { geometry, taskFactory });

    return new Npc(data, { actorFactory, htnFactory, frames, rootTask });
  }
}
