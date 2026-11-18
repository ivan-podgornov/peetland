import type { Task } from '@peetland/htn';
import type { Food } from '@peetland/inventory';
import type { NpcContext, NpcState } from '@peetland/npc';
import type { PlaceData } from '@peetland/places';

/** Создаёт задачи удовлетворения потребностей. Задачи одинаковые для всех типов NPC */
export interface INeedsTaskFactory {
  /** Создаёт задачу удовлетворить срочные потребности (см. NeedsTask) */
  satisfyNeeds(): Task<NpcState, NpcContext>;
  /** Создаёт задачу утолить голод (см. SatisfyHungerTask) */
  satisfyHunger(): Task<NpcState, NpcContext>;
  /** Создаёт задачу обзавестись жратвой про запас (см. StockFoodTask) */
  stockFood(): Task<NpcState, NpcContext>;
  /** Создаёт задачу купить еду в магазине (см. BuyFoodTask) */
  buyFood(options: BuyFoodTaskOptions): Task<NpcState, NpcContext>;
}

export type BuyFoodTaskOptions = {
  /** Какую еду купить */
  food: Food;
  /** В каком магазине */
  shop: PlaceData;
};
