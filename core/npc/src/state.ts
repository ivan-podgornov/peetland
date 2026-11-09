import type { Vector3 } from '@peetland/geometry';
import type { IReadonlyInventory } from '@peetland/inventory';
import type { IReadonlyPsyche } from '@peetland/psyche';
import type { TimeState } from '@peetland/timings';

/** Слепок состояния актора NPC на момент сбора состояния */
export type NpcActorState = Readonly<{
  position: Vector3;
  /** Угол поворота в градусах (см. IActor.getAngle) */
  angle: number;
}>;

/** Сам NPC: слепок актора, инвентарь и психика только на чтение */
export type NpcSelfState = Readonly<{
  actor: NpcActorState;
  inventory: IReadonlyInventory;
  psyche: IReadonlyPsyche;
}>;

/** Что NPC знает о мире на момент сбора состояния */
export type NpcWorldState = Readonly<{
  /** Слепок времени суток */
  time: TimeState;
}>;

/**
 * Состояние NPC, с которым HTN-агент планирует и исполняет задачи: сам NPC и то, что он знает о
 * мире. В нём лежат данные и сущности, доступные только на чтение. Эффекты задач не меняют
 * состояние: сущность, которую нужно поменять, задача клонирует и кладёт копию в новое состояние.
 * Команды живым актору, инвентарю и психике задачи отдают через контекст (см. NpcContext и ADR
 * «Состояние NPC из живых сущностей»)
 */
export type NpcState = Readonly<{
  self: NpcSelfState;
  world: NpcWorldState;
}>;
