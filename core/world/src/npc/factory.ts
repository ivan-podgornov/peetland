import type { IPlaces } from '../places';

import type { NpcData } from './data';
import { Npc } from './npc';
import type { NpcDeps } from './npc';

export type CreateNpcOptions = {
  /** Места мира, которыми пользуется NPC */
  places: IPlaces;
};

export interface INpcFactory {
  /** Создаёт NPC по данным. NPC живёт среди переданных мест */
  create(data: NpcData, options: CreateNpcOptions): Npc;
}

/** Зависимости фабрики NPC: всё, что нужно NPC, кроме мест, которые передаются при создании */
export type NpcFactoryDeps = Omit<NpcDeps, 'places'>;

export class NpcFactory implements INpcFactory {
  private readonly deps: NpcFactoryDeps;

  constructor(deps: NpcFactoryDeps) {
    this.deps = deps;
  }

  create(data: NpcData, options: CreateNpcOptions): Npc {
    return new Npc(data, { ...this.deps, places: options.places });
  }
}
