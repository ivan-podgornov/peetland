import type { IAddictions, IReadonlyAddictions } from '@peetland/addictions';
import type { IAbortSignal, Observable } from '@peetland/events';
import type { IActor } from '@peetland/game';
import type { Vector3 } from '@peetland/geometry';
import type { IHTN } from '@peetland/htn';
import type { Inventory, IReadonlyInventory } from '@peetland/inventory';
import type { IMemory, IReadonlyMemory } from '@peetland/memory';
import type { INeeds, IReadonlyNeeds, IUrgencyWatcher } from '@peetland/needs';
import type { IPsyche, IReadonlyPsyche } from '@peetland/psyche';
import type { IReadonlyTime } from '@peetland/timings';

import type { NpcContext } from './context';
import type { NpcKind } from './kind';

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

/** Слепок состояния актора NPC на момент сбора состояния */
export type NpcActorState = Readonly<{
  position: Vector3;
  /** Угол поворота в градусах (см. IActor.getAngle) */
  angle: number;
}>;

/** Сам NPC: тип, слепок актора, инвентарь, психика, потребности, зависимости и память только на чтение */
export type NpcSelfState = Readonly<{
  /** Тип NPC. Задачи, которые доступны не всем типам, проверяют его в предусловиях */
  kind: NpcKind;
  actor: NpcActorState;
  inventory: IReadonlyInventory;
  psyche: IReadonlyPsyche;
  /** Потребности. Их значения читаются на момент времени из того же состояния (см. INpcWorldKnowledge) */
  needs: IReadonlyNeeds;
  /** Зависимости. Их значения читаются на момент времени из того же состояния (см. INpcWorldKnowledge) */
  addictions: IReadonlyAddictions;
  /** Память NPC: факты о том, что с ним было. Запоминают через контекст (см. NpcContext) */
  memory: IReadonlyMemory;
}>;

/**
 * Состояние NPC, с которым HTN-агент планирует и исполняет задачи: сам NPC и то, что он знает о
 * мире. В нём лежат данные и сущности, доступные только на чтение. Эффекты задач не меняют
 * состояние: сущность, которую нужно поменять, задача клонирует и кладёт копию в новое состояние.
 * Команды живым актору, инвентарю, психике, потребностям, зависимостям и памяти задачи отдают
 * через контекст (см. NpcContext и ADR «Состояние NPC из живых сущностей»)
 */
export type NpcState = Readonly<{
  self: NpcSelfState;
  world: INpcWorldKnowledge;
}>;

/**
 * То, что NPC знает о мире. NPC объявляет, какое знание ему нужно, а реализует его мир, поэтому NPC
 * не зависит от мира. Знание создаётся для конкретного NPC, поэтому задача вызывает
 * state.world.getVisibleNpcs(radius) без указания NPC
 */
export interface INpcWorldKnowledge {
  /**
   * Время суток. Время идёт, поэтому геттеры могут вернуть разное даже за одно планирование. Если
   * эффекту задачи нужно поменять время, задача кладёт в новое состояние копию из clone()
   */
  readonly time: IReadonlyTime;

  /** Возвращает NPC, которых видит NPC, для которого создано знание, в радиусе radius */
  getVisibleNpcs(radius: number): INpc[];
}

/**
 * Создаёт знание о мире для конкретного NPC. Мир передаёт фабрику, а не готовое знание: знание
 * замыкает тело NPC, которого ещё нет, когда мир собирает зависимости
 */
export interface INpcWorldKnowledgeFactory {
  /** Создаёт знание о мире для тела NPC */
  create(actor: IActor): INpcWorldKnowledge;
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
  /** Память NPC */
  memory: IMemory;
  /** Наблюдатель, который следит, когда потребности становятся срочными */
  urgencyWatcher: IUrgencyWatcher;
  /** Сообщает о каждом тике мира */
  ticks: Observable<unknown>;
  /** То, что NPC знает о мире */
  worldKnowledge: INpcWorldKnowledge;
  /** Переходит в состояние aborted, когда игра завершается. Тогда NPC деспавнится */
  gameSignal: IAbortSignal;
}
