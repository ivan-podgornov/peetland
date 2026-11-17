import type { AchieveAngleOptions, GoToCoordsOptions } from '@peetland/game';
import type { ParallelTaskOptions, PrimitiveTask, Task } from '@peetland/htn';
import type { Food, Item } from '@peetland/inventory';
import type { NpcContext, NpcState } from '@peetland/npc';

import type { AddItemTaskOptions } from './add-item-task';
import type { NeedsPerformTaskOptions } from './needs-perform-task';
import type { PlayAnimationTaskOptions } from './play-animation-task';
import type { PsycheReactTaskOptions } from './psyche-react-task';
import type { RemoveItemTaskOptions } from './remove-item-task';
import type { TryLuckTaskOptions } from './try-luck-task';

export type NpcPrimitiveTask = PrimitiveTask<NpcState, NpcContext>;

/** Создаёт задачи, которые нужны любому NPC. Через неё составные задачи собирают свои методы */
export interface INpcTaskFactory {
  /** Идти к координатам (см. GoToCoordsTask) */
  goToCoords(options: GoToCoordsOptions): NpcPrimitiveTask;
  /** Повернуться на угол (см. AchieveAngleTask) */
  achieveAngle(options: AchieveAngleOptions): NpcPrimitiveTask;
  /** Проиграть анимацию (см. PlayAnimationTask) */
  playAnimation(options: PlayAnimationTaskOptions): NpcPrimitiveTask;
  /** Добавить предмет в инвентарь (см. AddItemTask) */
  addItem(options: AddItemTaskOptions): NpcPrimitiveTask;
  /** Отнять предмет из инвентаря (см. RemoveItemTask) */
  removeItem(options: RemoveItemTaskOptions): NpcPrimitiveTask;
  /** Сообщить психике о поступке (см. PsycheReactTask) */
  psycheReact(options: PsycheReactTaskOptions): NpcPrimitiveTask;
  /** Сообщить потребностям о занятии (см. NeedsPerformTask) */
  needsPerform(options: NeedsPerformTaskOptions): NpcPrimitiveTask;
  /** Пытать удачу, пока не повезёт (см. TryLuckTask) */
  tryLuck(options: TryLuckTaskOptions): NpcPrimitiveTask;
  /** Выполнять основную задачу и одновременно с ней фоновую (см. ParallelTask) */
  parallel(options: ParallelTaskOptions<NpcState, NpcContext>): NpcPrimitiveTask;
  /** Купить предмет там, где NPC стоит (см. PurchaseTask) */
  purchase(options: PurchaseTaskOptions): Task<NpcState, NpcContext>;
  /** Съесть еду из инвентаря там, где NPC стоит (см. EatTask) */
  eat(options: EatTaskOptions): Task<NpcState, NpcContext>;
}

export type PurchaseTaskOptions = {
  /** Какой предмет купить */
  item: Exclude<Item, Item.Money>;
  /** Сколько предмета купить */
  count: number;
  /** Сколько заплатить, в долларах */
  price: number;
};

export type EatTaskOptions = {
  /** Что съесть */
  food: Food;
};
