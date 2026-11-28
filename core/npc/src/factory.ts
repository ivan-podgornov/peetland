import type { IAddictionsFactory } from '@peetland/addictions';
import type { IAbortSignal, Observable } from '@peetland/events';
import type { IActorFactory } from '@peetland/game';
import type { IHTNFactory } from '@peetland/htn';
import { HTNFactory } from '@peetland/htn';
import type { IInventoryFactory } from '@peetland/inventory';
import { InventoryFactory } from '@peetland/inventory';
import type { IMemoryFactory } from '@peetland/memory';
import { MemoryFactory } from '@peetland/memory';
import type { INeedsFactory, IUrgencyWatcherFactory } from '@peetland/needs';
import { UrgencyWatcherFactory } from '@peetland/needs';
import type { IPsycheFactory } from '@peetland/psyche';
import { PsycheFactory } from '@peetland/psyche';

import type { NpcContext } from './context';
import type { NpcData } from './data';
import { Npc } from './npc';
import type { IRootTaskFactory } from './root-task-factory';
import type { IActorNpcRegistry, INpcWorldKnowledgeFactory, NpcState } from './types';

export interface INpcFactory {
  /** Создаёт NPC по данным */
  create(data: NpcData): Npc;
}

/**
 * Зависимости фабрики NPC. Снаружи нужны игра, её сигнал завершения, знание о мире, корневые задачи,
 * потребности и зависимости, а остальные фабрики сущностей она создаёт сама, если их не передали
 */
export interface NpcFactoryDeps {
  /** Фабрика, которая создаёт актора — тело NPC */
  actorFactory: IActorFactory;
  /** Реестр, в котором NPC связывает своего актора с собой */
  actorNpcRegistry: IActorNpcRegistry;
  /** Сообщает о каждом тике мира */
  ticks: Observable<unknown>;
  /** Фабрика, которая создаёт HTN-агентов. Агент сам планирует и перепланирует задачи */
  htnFactory?: IHTNFactory<NpcState, NpcContext>;
  /** Фабрика, которая создаёт инвентари */
  inventoryFactory?: IInventoryFactory;
  /** Фабрика, которая создаёт память NPC */
  memoryFactory?: IMemoryFactory;
  /** Фабрика, которая создаёт психики */
  psycheFactory?: IPsycheFactory;
  /** Фабрика, которая создаёт потребности. Фабрика сама знает время, с которого потребности падают */
  needsFactory: INeedsFactory;
  /** Фабрика, которая создаёт зависимости. Фабрика сама знает время, с которого растёт тяга */
  addictionsFactory: IAddictionsFactory;
  /** Фабрика, которая создаёт наблюдателей, следящих, когда потребности становятся срочными */
  urgencyWatcherFactory?: IUrgencyWatcherFactory;
  /** Фабрика, которая создаёт корневую задачу HTN-агента по типу NPC */
  rootTaskFactory: IRootTaskFactory;
  /** Переходит в состояние aborted, когда игра завершается. Тогда NPC деспавнится */
  gameSignal: IAbortSignal;
  /** Фабрика, которая создаёт знание о мире для NPC */
  worldKnowledgeFactory: INpcWorldKnowledgeFactory;
}

export class NpcFactory implements INpcFactory {
  private readonly deps: Required<NpcFactoryDeps>;

  constructor(deps: NpcFactoryDeps) {
    const {
      actorFactory,
      actorNpcRegistry,
      ticks,
      htnFactory = new HTNFactory<NpcState, NpcContext>(),
      inventoryFactory = new InventoryFactory(),
      memoryFactory = new MemoryFactory(),
      psycheFactory = new PsycheFactory(),
      needsFactory,
      addictionsFactory,
      urgencyWatcherFactory = new UrgencyWatcherFactory(),
      rootTaskFactory,
      gameSignal,
      worldKnowledgeFactory,
    } = deps;

    this.deps = {
      actorFactory,
      actorNpcRegistry,
      ticks,
      htnFactory,
      inventoryFactory,
      memoryFactory,
      psycheFactory,
      needsFactory,
      addictionsFactory,
      urgencyWatcherFactory,
      rootTaskFactory,
      gameSignal,
      worldKnowledgeFactory,
    };
  }

  create(data: NpcData): Npc {
    const {
      actorFactory,
      actorNpcRegistry,
      ticks,
      htnFactory,
      inventoryFactory,
      memoryFactory,
      psycheFactory,
      needsFactory,
      addictionsFactory,
      urgencyWatcherFactory,
      rootTaskFactory,
      gameSignal,
      worldKnowledgeFactory,
    } = this.deps;
    const rootTask = rootTaskFactory.create(data.kind);
    const actor = actorFactory.create({
      modelId: data.modelId,
      position: data.spawnPosition,
      angle: data.spawnAngle,
    });

    return new Npc(data, {
      actor,
      actorNpcRegistry,
      htn: htnFactory.create(rootTask),
      inventory: inventoryFactory.create(data.inventory),
      memory: memoryFactory.create(),
      psyche: psycheFactory.create(data.psyche),
      needs: needsFactory.create(data.needs),
      addictions: addictionsFactory.create(data.addictions),
      urgencyWatcher: urgencyWatcherFactory.create(),
      ticks,
      worldKnowledgeFactory,
      gameSignal,
    });
  }
}
