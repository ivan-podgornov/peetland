import type { Vector3 } from '@peetland/geometry';
import type { InventoryCounts } from '@peetland/inventory';

/** Черты характера NPC. Не меняются со временем */
export type NpcTraits = Readonly<{
  /** Совестливость от 0 до 100. Чем она выше, тем быстрее растёт стыд при клянчанье */
  conscientiousness: number;
}>;

/** Чувства NPC. Меняются в зависимости от того, чем NPC занимается */
export type NpcFeelings = Readonly<{
  /** Стыд от 0 до 100 */
  shame: number;
}>;

/** Данные NPC, которые хранятся в репозитории */
export type NpcData = Readonly<{
  id: string;
  /** ID игровой модели */
  modelId: number;
  /** Позиция, на которой спавнится NPC */
  spawnPosition: Vector3;
  /** Угол поворота в градусах, на который NPC повёрнут при спавне */
  spawnAngle: number;
  traits: NpcTraits;
  /** Начальные чувства */
  feelings: NpcFeelings;
  /** Начальное количество каждого предмета в инвентаре */
  inventory: InventoryCounts;
}>;
