import type { Task } from '@peetland/htn';
import type { NpcContext, NpcState } from '@peetland/npc';
import type { PlaceData } from '@peetland/places';

/** Создаёт задачи удовлетворения зависимостей. Задачи одинаковые для всех типов NPC */
export interface IAddictionsTaskFactory {
  /** Создаёт задачу удовлетворить зависимости (см. AddictionsTask) */
  satisfyAddictions(): Task<NpcState, NpcContext>;
  /** Создаёт задачу удовлетворить алкоголизм (см. SatisfyAlcoholismTask) */
  satisfyAlcoholism(): Task<NpcState, NpcContext>;
  /** Создаёт задачу купить пойло в магазине (см. BuyBoozeTask) */
  buyBooze(options: BuyBoozeTaskOptions): Task<NpcState, NpcContext>;
}

export type BuyBoozeTaskOptions = {
  /** В каком магазине */
  shop: PlaceData;
};
