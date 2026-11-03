import { HTNFactory } from '@peetland/htn';
import { InventoryFactory } from '@peetland/inventory';
import { PsycheFactory } from '@peetland/psyche';

import type { NpcContext } from './context';
import type { NpcData } from './data';
import { Npc } from './npc';
import type { NpcDeps } from './npc';
import type { NpcState } from './state';

export interface INpcFactory {
  /** Создаёт NPC по данным */
  create(data: NpcData): Npc;
}

/**
 * Зависимости фабрики NPC. Снаружи нужны игра, знание о мире и корневые задачи, а остальное фабрика собирает
 * сама, если его не передали
 */
export type NpcFactoryDeps = Pick<
  NpcDeps,
  'actorFactory' | 'frames' | 'rootTaskFactory' | 'worldKnowledge'
> &
  Partial<Pick<NpcDeps, 'htnFactory' | 'inventoryFactory' | 'psycheFactory'>>;

export class NpcFactory implements INpcFactory {
  private readonly deps: NpcDeps;

  constructor(deps: NpcFactoryDeps) {
    const {
      actorFactory,
      frames,
      rootTaskFactory,
      worldKnowledge,
      htnFactory = new HTNFactory<NpcState, NpcContext>(),
      inventoryFactory = new InventoryFactory(),
      psycheFactory = new PsycheFactory(),
    } = deps;

    this.deps = {
      actorFactory,
      frames,
      htnFactory,
      inventoryFactory,
      psycheFactory,
      rootTaskFactory,
      worldKnowledge,
    };
  }

  create(data: NpcData): Npc {
    return new Npc(data, this.deps);
  }
}
