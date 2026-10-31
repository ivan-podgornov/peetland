import type { Vector3 } from '@peetland/geometry';
import type { InventoryCounts } from '@peetland/inventory';

import type { NpcFeelings, NpcTraits } from './data';

/** Слепок состояния актора NPC на момент сбора состояния */
export type NpcActorState = Readonly<{
  position: Vector3;
  /** Угол поворота в градусах (см. IActor.getAngle) */
  angle: number;
}>;

/**
 * Состояние NPC, с которым HTN-агент планирует и исполняет задачи. Содержит только данные: слепок
 * актора и содержимое инвентаря. Эффекты задач меняют копию этих данных, а команды живым актору и
 * инвентарю задачи отдают через контекст (см. NpcContext)
 */
export type NpcState = Readonly<{
  actor: NpcActorState;
  inventory: Readonly<InventoryCounts>;
  traits: NpcTraits;
  feelings: NpcFeelings;
}>;
