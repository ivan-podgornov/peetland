import type { Vector3 } from '@peetland/geometry';
import type { InventoryCounts } from '@peetland/inventory';
import type { PsycheState } from '@peetland/psyche';
import type { TimeState } from '@peetland/timings';

/** Слепок состояния актора NPC на момент сбора состояния */
export type NpcActorState = Readonly<{
  position: Vector3;
  /** Угол поворота в градусах (см. IActor.getAngle) */
  angle: number;
}>;

/** Слепок самого NPC: актора, инвентаря и психики */
export type NpcSelfState = Readonly<{
  actor: NpcActorState;
  inventory: Readonly<InventoryCounts>;
  psyche: PsycheState;
}>;

/** Что NPC знает о мире на момент сбора состояния */
export type NpcWorldState = Readonly<{
  /** Слепок времени суток */
  time: TimeState;
}>;

/**
 * Состояние NPC, с которым HTN-агент планирует и исполняет задачи. Содержит только данные: слепок
 * самого NPC и то, что он знает о мире. Эффекты задач меняют копию этих данных, а команды живым
 * актору, инвентарю и психике задачи отдают через контекст (см. NpcContext)
 */
export type NpcState = Readonly<{
  self: NpcSelfState;
  world: NpcWorldState;
}>;
