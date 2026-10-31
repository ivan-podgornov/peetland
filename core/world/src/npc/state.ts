import type { IActor } from '@peetland/game';
import type { Inventory } from '@peetland/inventory';

/**
 * Состояние NPC, с которым HTN-агент планирует и исполняет задачи. Инвентарь и актор — живые, а
 * не копии: задачи при исполнении меняют настоящий инвентарь NPC. Копию инвентаря задача делает
 * только в applyEffects через clone()
 */
export type NpcState = Readonly<{
  actor: IActor;
  inventory: Inventory;
  /** Совестливость от 0 до 100 */
  conscientiousness: number;
  /** Стыд от 0 до 100 */
  shame: number;
}>;
