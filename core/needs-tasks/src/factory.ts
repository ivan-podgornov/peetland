import type { IGeometry } from '@peetland/geometry';
import type { Task } from '@peetland/htn';
import { ItemClassifier } from '@peetland/inventory';
import type { IItemClassifier } from '@peetland/inventory';
import type { NpcContext, NpcState } from '@peetland/npc';
import { NpcTaskFactory } from '@peetland/npc-tasks';
import type { INpcTaskFactory } from '@peetland/npc-tasks';
import type { IPlaces } from '@peetland/places';
import type { IRandom } from '@peetland/random';
import type { ITimer } from '@peetland/timings';

import { BuyFoodTask } from './buy-food-task';
import { FoodChooser } from './food-chooser';
import type { IFoodChooser } from './food-chooser';
import { NeedsTask } from './needs-task';
import { SatisfyHungerTask } from './satisfy-hunger-task';
import { StockFoodTask } from './stock-food-task';
import type { BuyFoodTaskOptions, INeedsTaskFactory } from './types';

export type NeedsTaskFactoryDeps = {
  geometry: IGeometry;
  /** Места мира, которые получают задачи */
  places: IPlaces;
  random: IRandom;
  timer: ITimer;
  /** Фабрика задач NPC, которую получают задачи. По умолчанию — NpcTaskFactory */
  npcTaskFactory?: INpcTaskFactory;
  /** Классификатор предметов, которым выбор еды по умолчанию ищет еду. По умолчанию — ItemClassifier */
  itemClassifier?: IItemClassifier;
  /**
   * Выбирает оптимальную еду с учётом цены, сытости, при которой NPC её съест, и питательности. По
   * умолчанию — FoodChooser
   */
  foodChooser?: IFoodChooser;
};

/** Создаёт задачи удовлетворения потребностей. На каждый вызов задача новая */
export class NeedsTaskFactory implements INeedsTaskFactory {
  private readonly places: IPlaces;
  private readonly npcTaskFactory: INpcTaskFactory;
  private readonly foodChooser: IFoodChooser;

  constructor(deps: NeedsTaskFactoryDeps) {
    const {
      geometry,
      places,
      random,
      timer,
      npcTaskFactory = new NpcTaskFactory({
        geometry,
        random,
        timer,
      }),
      itemClassifier = new ItemClassifier(),
      foodChooser = new FoodChooser({ itemClassifier }),
    } = deps;

    this.places = places;
    this.npcTaskFactory = npcTaskFactory;
    this.foodChooser = foodChooser;
  }

  satisfyNeeds(): Task<NpcState, NpcContext> {
    return new NeedsTask({ needsTaskFactory: this });
  }

  satisfyHunger(): Task<NpcState, NpcContext> {
    const { places, npcTaskFactory, foodChooser } = this;

    return new SatisfyHungerTask({
      npcTaskFactory,
      needsTaskFactory: this,
      places,
      foodChooser,
    });
  }

  stockFood(): Task<NpcState, NpcContext> {
    const { places, foodChooser } = this;

    return new StockFoodTask({
      needsTaskFactory: this,
      places,
      foodChooser,
    });
  }

  buyFood(options: BuyFoodTaskOptions): Task<NpcState, NpcContext> {
    const { npcTaskFactory } = this;

    return new BuyFoodTask(options, { npcTaskFactory });
  }
}
