import type { Vector3 } from '@peetland/geometry';
import type { Inventory } from '@peetland/inventory';

import type { NpcFeelings, NpcTraits } from './data';

/** Слепок состояния актора NPC на момент сбора состояния */
export type NpcActorState = Readonly<{
  position: Vector3;
  /** Угол поворота в градусах (см. IActor.getAngle) */
  angle: number;
}>;

/**
 * Состояние NPC, с которым HTN-агент планирует и исполняет задачи. Инвентарь — живой, а не копия:
 * задачи при исполнении меняют настоящий инвентарь NPC. Копию инвентаря задача делает только в
 * applyEffects через clone(). Актора в состоянии нет, только слепок: команды актору задачи отдают
 * через актора, которого получили при создании
 */
export type NpcState = Readonly<{
  actor: NpcActorState;
  inventory: Inventory;
  traits: NpcTraits;
  feelings: NpcFeelings;
}>;
