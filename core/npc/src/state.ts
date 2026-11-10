import type { Vector3 } from '@peetland/geometry';
import type { IReadonlyInventory } from '@peetland/inventory';
import type { IReadonlyNeeds } from '@peetland/needs';
import type { IReadonlyPsyche } from '@peetland/psyche';
import type { IReadonlyTime } from '@peetland/timings';

/** Слепок состояния актора NPC на момент сбора состояния */
export type NpcActorState = Readonly<{
  position: Vector3;
  /** Угол поворота в градусах (см. IActor.getAngle) */
  angle: number;
}>;

/** Сам NPC: слепок актора, инвентарь, психика и потребности только на чтение */
export type NpcSelfState = Readonly<{
  actor: NpcActorState;
  inventory: IReadonlyInventory;
  psyche: IReadonlyPsyche;
  /** Потребности. Их значения читаются на момент времени из того же состояния (см. NpcWorldState) */
  needs: IReadonlyNeeds;
}>;

/** Что NPC знает о мире */
export type NpcWorldState = Readonly<{
  /**
   * Время суток. Время идёт, поэтому геттеры могут вернуть разное даже за одно планирование. Если
   * эффекту задачи нужно поменять время, задача кладёт в новое состояние копию из clone()
   */
  time: IReadonlyTime;
}>;

/**
 * Состояние NPC, с которым HTN-агент планирует и исполняет задачи: сам NPC и то, что он знает о
 * мире. В нём лежат данные и сущности, доступные только на чтение. Эффекты задач не меняют
 * состояние: сущность, которую нужно поменять, задача клонирует и кладёт копию в новое состояние.
 * Команды живым актору, инвентарю, психике и потребностям задачи отдают через контекст (см. NpcContext и ADR
 * «Состояние NPC из живых сущностей»)
 */
export type NpcState = Readonly<{
  self: NpcSelfState;
  world: NpcWorldState;
}>;
