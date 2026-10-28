import type { Vector3 } from '@peetland/geometry';
import type { InventoryCounts } from '@peetland/inventory';

/** Данные NPC, которые хранятся в репозитории */
export type NpcData = {
  readonly id: string;
  /** ID игровой модели */
  readonly modelId: number;
  /** Позиция, на которой спавнится NPC */
  readonly spawnPosition: Vector3;
  /** Наглость от 0 до 100. Чем она выше, тем медленнее растёт стыд при клянчанье */
  readonly impudence: number;
  /** Начальный стыд от 0 до 100 */
  readonly shame: number;
  /** Начальное количество каждого предмета в инвентаре */
  readonly inventory: InventoryCounts;
};
