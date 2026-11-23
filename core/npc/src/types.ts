import type { IAddictionsFactory } from '@peetland/addictions';
import type { IAbortSignal, Observable } from '@peetland/events';
import type { IActor, IActorFactory } from '@peetland/game';
import type { IHTNFactory } from '@peetland/htn';
import type { IInventoryFactory } from '@peetland/inventory';
import type { INeedsFactory, IUrgencyWatcherFactory } from '@peetland/needs';
import type { IPsycheFactory } from '@peetland/psyche';

import type { NpcContext } from './context';
import type { IRootTaskFactory } from './root-task-factory';
import type { NpcState } from './state';
import type { INpcWorldKnowledge } from './world-knowledge';

/** Реестр связей «актор ↔ NPC»: тело ↔ личность */
export interface IActorNpcRegistry<TNpc> {
  /** Связывает актора с NPC и убирает связь, когда сигнал прерван */
  register(actor: IActor, npc: TNpc, signal: IAbortSignal): void;

  /** Возвращает актора, который является телом NPC */
  getActor(npc: TNpc): IActor | undefined;

  /** Возвращает NPC, чьим телом является актор */
  getNpc(actor: IActor): TNpc | undefined;
}

/** Зависимости NPC. Личность — дженерик, чтобы файл типов не зависел от npc.ts */
export interface INpcDeps<TNpc> {
  /** Фабрика, которой NPC создаёт своего актора */
  actorFactory: IActorFactory;
  /** Реестр, в котором NPC связывает своего актора с собой */
  actorNpcRegistry: IActorNpcRegistry<TNpc>;
  /** Фабрика, которой NPC создаёт своего HTN-агента. Агент сам планирует и перепланирует задачи */
  htnFactory: IHTNFactory<NpcState, NpcContext>;
  /** Фабрика, которой NPC создаёт свой инвентарь */
  inventoryFactory: IInventoryFactory;
  /** Фабрика, которой NPC создаёт свою психику */
  psycheFactory: IPsycheFactory;
  /** Фабрика, которой NPC создаёт свои потребности */
  needsFactory: INeedsFactory;
  /** Фабрика, которой NPC создаёт свои зависимости */
  addictionsFactory: IAddictionsFactory;
  /** Фабрика, которой NPC создаёт наблюдателя, который следит, когда потребности становятся срочными */
  urgencyWatcherFactory: IUrgencyWatcherFactory;
  /** Фабрика, которой NPC создаёт корневую задачу своего HTN-агента по своему типу */
  rootTaskFactory: IRootTaskFactory;
  /** Сообщает о каждом тике мира */
  ticks: Observable<unknown>;
  /** То, что NPC знает о мире */
  worldKnowledge: INpcWorldKnowledge;
  /** Переходит в состояние aborted, когда игра завершается. Тогда NPC деспавнится */
  gameSignal: IAbortSignal;
}
