import type { Vector3 } from '@peetland/geometry';
import type { InventoryCounts } from '@peetland/inventory';
import type { NeedValues } from '@peetland/needs';
import type { PsycheState } from '@peetland/psyche';

import type { NpcKind } from './kind';

/** Данные NPC, которые хранятся в репозитории */
export type NpcData = Readonly<{
  id: string;
  /** Тип NPC, от него зависит корневая задача */
  kind: NpcKind;
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
  /** Начальное значение каждой потребности. Потребности начинают падать с момента, когда NPC создан */
  needs: NeedValues;
}>;
