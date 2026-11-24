import type { IAddictionsFactory } from '@peetland/addictions';
import { AddictionsFactory } from '@peetland/addictions';
import type { IAbortSignal, Observable } from '@peetland/events';
import type { IActorFactory } from '@peetland/game';
import type { IHTNFactory } from '@peetland/htn';
import { HTNFactory } from '@peetland/htn';
import type { IInventoryFactory } from '@peetland/inventory';
import { InventoryFactory } from '@peetland/inventory';
import type { INeedsFactory, IUrgencyWatcherFactory } from '@peetland/needs';
import { NeedsFactory, UrgencyWatcherFactory } from '@peetland/needs';
import type { IPsycheFactory } from '@peetland/psyche';
import { PsycheFactory } from '@peetland/psyche';

import type { NpcContext } from './context';
import type { NpcData } from './data';
import { Npc } from './npc';
import type { IRootTaskFactory } from './root-task-factory';
import type { NpcState } from './state';
import type { IActorNpcRegistry, INpcWorldKnowledge } from './types';

export interface INpcFactory {
  /** Создаёт NPC по данным */
  create(data: NpcData): Npc;
}

/**
 * Зависимости фабрики NPC. Снаружи нужны игра, её сигнал завершения, знание о мире и корневые задачи, а фабрики сущностей она
 * создаёт сама, если их не передали
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
  /** Фабрика, которая создаёт психики */
  psycheFactory?: IPsycheFactory;
  /** Фабрика, которая создаёт потребности */
  needsFactory?: INeedsFactory;
  /** Фабрика, которая создаёт зависимости */
  addictionsFactory?: IAddictionsFactory;
  /** Фабрика, которая создаёт наблюдателей, следящих, когда потребности становятся срочными */
  urgencyWatcherFactory?: IUrgencyWatcherFactory;
  /** Фабрика, которая создаёт корневую задачу HTN-агента по типу NPC */
  rootTaskFactory: IRootTaskFactory;
  /** Переходит в состояние aborted, когда игра завершается. Тогда NPC деспавнится */
  gameSignal: IAbortSignal;
  /** То, что NPC знает о мире */
  worldKnowledge: INpcWorldKnowledge;
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
      psycheFactory = new PsycheFactory(),
      needsFactory = new NeedsFactory(),
      addictionsFactory = new AddictionsFactory(),
      urgencyWatcherFactory = new UrgencyWatcherFactory(),
      rootTaskFactory,
      gameSignal,
      worldKnowledge,
    } = deps;

    this.deps = {
      actorFactory,
      actorNpcRegistry,
      ticks,
      htnFactory,
      inventoryFactory,
      psycheFactory,
      needsFactory,
      addictionsFactory,
      urgencyWatcherFactory,
      rootTaskFactory,
      gameSignal,
      worldKnowledge,
    };
  }

  create(data: NpcData): Npc {
    const {
      actorFactory,
      actorNpcRegistry,
      ticks,
      htnFactory,
      inventoryFactory,
      psycheFactory,
      needsFactory,
      addictionsFactory,
      urgencyWatcherFactory,
      rootTaskFactory,
      gameSignal,
      worldKnowledge,
    } = this.deps;
    const { time } = worldKnowledge.getState();
    const rootTask = rootTaskFactory.create(data.kind);

    return new Npc(data.id, data.kind, {
      actor: actorFactory.create({
        modelId: data.modelId,
        position: data.spawnPosition,
        angle: data.spawnAngle,
      }),
      actorNpcRegistry,
      htn: htnFactory.create(rootTask),
      inventory: inventoryFactory.create(data.inventory),
      psyche: psycheFactory.create(data.psyche),
      needs: needsFactory.create(data.needs, time),
      addictions: addictionsFactory.create(data.addictions, time),
      urgencyWatcher: urgencyWatcherFactory.create(),
      ticks,
      worldKnowledge,
      gameSignal,
    });
  }
}
