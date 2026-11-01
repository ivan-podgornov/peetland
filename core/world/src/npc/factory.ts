import type { Observable } from '@peetland/events';
import type { IActorFactory } from '@peetland/game';
import type { IHTNFactory } from '@peetland/htn';
import type { IInventoryFactory } from '@peetland/inventory';

import type { PlaceData } from '../places';
import type { IRootTaskFactory } from '../tasks';

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
  /** Фабрика, которой NPC создают свои инвентари */
  inventoryFactory: IInventoryFactory;
  /** Сообщает о каждом кадре игры */
  frames: Observable<unknown>;
  /** Фабрика корневых задач, которые планируют HTN-агенты NPC */
  rootTaskFactory: IRootTaskFactory;
};

export class NpcFactory implements INpcFactory {
  private readonly deps: NpcFactoryDeps;

  constructor(deps: NpcFactoryDeps) {
    this.deps = deps;
  }

  create(data: NpcData, options: CreateNpcOptions): Npc {
    const { actorFactory, htnFactory, inventoryFactory, frames, rootTaskFactory } = this.deps;
    const rootTask = rootTaskFactory.create({ places: options.places });

    return new Npc(data, { actorFactory, htnFactory, inventoryFactory, frames, rootTask });
  }
}
