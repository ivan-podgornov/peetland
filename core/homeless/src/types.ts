import type { Task } from '@peetland/htn';
import type { NpcContext, NpcState } from '@peetland/npc';

import type { PurchaseTaskOptions } from './purchase-task';

type NpcTask = Task<NpcState, NpcContext>;

/**
 * Создаёт составные задачи бомжа. Через неё составные задачи собирают методы из других составных
 * задач, а примитивы берут у фабрики примитивов (см. INpcTaskFactory)
 */
export interface IHomelessTaskFactory {
  /** Купить предмет там, где NPC стоит (см. PurchaseTask) */
  purchase(options: PurchaseTaskOptions): NpcTask;
  /** Купить пойло в ближайшем магазине (см. BuyBoozeTask) */
  buyBooze(): NpcTask;
  /** Бухать в бомжарне (см. DrinkTask) */
  drink(): NpcTask;
  /** Сдать бутылки в ближайшей приёмке (см. SellBottlesTask) */
  sellBottles(): NpcTask;
  /** Собрать бутылки в случайной мусорке (см. CollectBottlesTask) */
  collectBottles(): NpcTask;
  /** Клянчить у ближайшего места для клянчанья (см. BegTask) */
  beg(): NpcTask;
}
