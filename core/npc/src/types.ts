import type { IAddictions, IAddictionsFactory } from '@peetland/addictions';
import type { IAbortSignal, Observable } from '@peetland/events';
import type { IActor, IActorFactory } from '@peetland/game';
import type { IHTNFactory } from '@peetland/htn';
import type { Inventory, IInventoryFactory } from '@peetland/inventory';
import type { INeeds, INeedsFactory, IUrgencyWatcherFactory } from '@peetland/needs';
import type { IPsyche, IPsycheFactory } from '@peetland/psyche';

import type { NpcContext } from './context';
import type { NpcKind } from './kind';
import type { IRootTaskFactory } from './root-task-factory';
import type { NpcState } from './state';
import type { INpcWorldKnowledge } from './world-knowledge';

/** NPC — личность, которая живёт в теле-акторе */
export interface INpc {
  /**
   * Сигнал жизни NPC. Пока NPC жив, сигнал в состоянии pending. despawn переводит его в состояние
   * aborted, и после этого NPC больше не пользуются
   */
  readonly signal: IAbortSignal;

  /** Уникальный идентификатор NPC */
  readonly id: string;

  /** Тип NPC, по которому подбирается корневая задача */
  readonly kind: NpcKind;

  /** Инвентарь NPC */
  readonly inventory: Inventory;

  /** Психика NPC */
  readonly psyche: IPsyche;

  /** Потребности NPC */
  readonly needs: INeeds;

  /** Зависимости NPC */
  readonly addictions: IAddictions;

  /** Возвращает состояние NPC: слепок самого NPC и то, что он знает о мире (см. NpcState) */
  getState(): NpcState;

  /**
   * Завершает жизнь NPC: перестаёт следить за тиками, останавливает HTN-агента и деспавнит
   * актора. После деспавна NPC больше не пользуются
   */
  despawn(): void;
}

/** Реестр связей «актор ↔ NPC»: тело ↔ личность */
export interface IActorNpcRegistry {
  /** Связывает актора с NPC и убирает связь, когда сигнал жизни NPC прерван */
  register(actor: IActor, npc: INpc): void;

  /** Возвращает актора, который является телом NPC */
  getActor(npc: INpc): IActor | undefined;

  /** Возвращает NPC, чьим телом является актор */
  getNpc(actor: IActor): INpc | undefined;
}

/** Зависимости NPC */
export interface NpcDeps {
  /** Фабрика, которой NPC создаёт своего актора */
  actorFactory: IActorFactory;
  /** Реестр, в котором NPC связывает своего актора с собой */
  actorNpcRegistry: IActorNpcRegistry;
  /** Фабрика, которой NPC создаёт свой HTN-агент. Агент сам планирует и перепланирует задачи */
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
