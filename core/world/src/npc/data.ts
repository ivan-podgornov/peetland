import type { Vector3 } from '@peetland/geometry';
import type { InventoryCounts } from '@peetland/inventory';
import type { PsycheState } from '@peetland/psyche';

/** Данные NPC, которые хранятся в репозитории */
export type NpcData = Readonly<{
  id: string;
  /** ID игровой модели */
  modelId: number;
  /** Позиция, на которой спавнится NPC */
  spawnPosition: Vector3;
  /** Угол поворота в градусах, с которым спавнится NPC */
  spawnAngle: number;
  /** Начальное состояние психики: черты характера и чувства */
  psyche: PsycheState;
  /** Начальное количество каждого предмета в инвентаре */
  inventory: InventoryCounts;
}>;
