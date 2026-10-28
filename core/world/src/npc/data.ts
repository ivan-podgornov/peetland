import type { Vector3 } from '@peetland/geometry';
import type { InventoryCounts } from '@peetland/inventory';

/** Данные NPC, которые хранятся в репозитории */
export type NpcData = Readonly<{
  id: string;
  /** ID игровой модели */
  modelId: number;
  /** Позиция, на которой спавнится NPC */
  spawnPosition: Vector3;
  /** Наглость от 0 до 100. Чем она выше, тем медленнее растёт стыд при клянчанье */
  impudence: number;
  /** Начальный стыд от 0 до 100 */
  shame: number;
  /** Начальное количество каждого предмета в инвентаре */
  inventory: InventoryCounts;
}>;
