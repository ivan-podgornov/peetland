import type { IAddictions } from '@peetland/addictions';
import type { IAbortSignal, Observable } from '@peetland/events';
import type { IActor } from '@peetland/game';
import type { IHTN } from '@peetland/htn';
import type { Inventory } from '@peetland/inventory';
import type { INeeds, IUrgencyWatcher } from '@peetland/needs';
import type { IPsyche } from '@peetland/psyche';

import type { NpcContext } from './context';
import type { NpcKind } from './kind';
import type { NpcState, NpcWorldState } from './state';

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

  /**
   * Возвращает актора, который является телом NPC. Бросает ошибку, если NPC не в реестре: это
   * ошибка вызывающего кода
   */
  getActor(npc: INpc): IActor;

  /**
   * Возвращает NPC, чьим телом является актор. Бросает ошибку, если у актора нет NPC: это
   * ошибка вызывающего кода
   */
  getNpc(actor: IActor): INpc;
}

/**
 * То, что NPC знает о мире. NPC объявляет, какое знание ему нужно, а реализует его мир, поэтому NPC
 * не зависит от мира
 */
export interface INpcWorldKnowledge {
  /** Возвращает то, что NPC знает о мире */
  getState(): NpcWorldState;

  /** Возвращает NPC, которых видит target в радиусе radius */
  getVisibleNpcs(target: INpc, radius: number): INpc[];
}

/** Зависимости NPC: готовые сущности, с которыми он живёт, и сервисы мира */
export interface NpcDeps {
  /** Актор — тело NPC */
  actor: IActor;
  /** Реестр, в котором NPC связывает своего актора с собой */
  actorNpcRegistry: IActorNpcRegistry;
  /** HTN-агент, который планирует и исполняет задачи NPC */
  htn: IHTN<NpcState, NpcContext>;
  /** Инвентарь NPC */
  inventory: Inventory;
  /** Психика NPC */
  psyche: IPsyche;
  /** Потребности NPC */
  needs: INeeds;
  /** Зависимости NPC */
  addictions: IAddictions;
  /** Наблюдатель, который следит, когда потребности становятся срочными */
  urgencyWatcher: IUrgencyWatcher;
  /** Сообщает о каждом тике мира */
  ticks: Observable<unknown>;
  /** То, что NPC знает о мире */
  worldKnowledge: INpcWorldKnowledge;
  /** Переходит в состояние aborted, когда игра завершается. Тогда NPC деспавнится */
  gameSignal: IAbortSignal;
}
