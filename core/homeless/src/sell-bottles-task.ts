import { TransactionTask } from '@peetland/htn';
import type { CompoundTask, Method, Task } from '@peetland/htn';
import { Item } from '@peetland/inventory';

import type { NpcContext, NpcState } from '@peetland/npc';
import type { INpcTaskFactory } from '@peetland/npc-tasks';
import { PlaceType } from '@peetland/places';
import type { IPlaces } from '@peetland/places';

import { BOOZE_PRICE, BOTTLE_PRICE } from './constants';

export type SellBottlesTaskDeps = {
  /** Места мира. Бутылки сдаются в местах типа PlaceType.BottleCollection */
  places: IPlaces;
  npcTaskFactory: INpcTaskFactory;
};

/**
 * Сдать бутылки в ближайшей приёмке: все бутылки, по BOTTLE_PRICE за штуку. Приёмка и количество
 * бутылок определяются при планировании, один раз на весь план. Сдавать идёт, только если есть
 * что сдать и после сдачи денег хватит на пойло
 */
export class SellBottlesTask implements CompoundTask<NpcState, NpcContext> {
  /** На каком расстоянии от приёмки можно считать, что NPC до неё дошёл, в метрах */
  private static readonly COLLECTION_COMPLETE_RADIUS = 0.5;

  /** Насколько NPC может быть отвёрнут от приёмщика, чтобы сдать бутылки, в градусах */
  private static readonly COLLECTION_FACING_TOLERANCE = 15;

  readonly name = 'sell-bottles';

  readonly methods: Method<NpcState, NpcContext>[];

  private readonly places: IPlaces;
  private readonly deps: SellBottlesTaskDeps;

  constructor(deps: SellBottlesTaskDeps) {
    this.places = deps.places;
    this.deps = deps;
    this.methods = [
      {
        name: 'sell-in-nearest-collection',
        preconditions: (state) => this.canSell(state),
        tasks: (state) => this.sellInNearestCollection(state),
      },
    ];
  }

  /**
   * Сдавать бутылки есть смысл, только если они есть и на вырученные деньги вместе с теми, что уже
   * есть, можно купить пойло. И если есть приёмка, где их сдать
   */
  private canSell(state: NpcState): boolean {
    const money = state.self.inventory.get(Item.Money);
    const bottles = this.countBottles(state);

    return (
      bottles > 0 &&
      money + bottles * BOTTLE_PRICE >= BOOZE_PRICE &&
      this.places.ofType(PlaceType.BottleCollection).length > 0
    );
  }

  /** Собирает задачи сдачи всех бутылок в приёмке, ближайшей к NPC */
  private sellInNearestCollection(state: NpcState): Task<NpcState, NpcContext>[] {
    const { npcTaskFactory } = this.deps;
    const collection = this.places.findNearest(
      state.self.actor.position,
      PlaceType.BottleCollection
    );

    if (!collection) {
      throw new Error('Не из чего выбрать приёмку');
    }

    const bottles = this.countBottles(state);

    return [
      npcTaskFactory.goToCoords({
        coords: collection.position,
        completeRadius: SellBottlesTask.COLLECTION_COMPLETE_RADIUS,
      }),
      npcTaskFactory.achieveAngle({
        angle: collection.angle,
        tolerance: SellBottlesTask.COLLECTION_FACING_TOLERANCE,
      }),
      // Сдача — транзакция: если NPC отдал бутылки, он не уйдёт без денег
      new TransactionTask('hand-over-bottles', [
        npcTaskFactory.playAnimation({ animation: 'item-give' }),
        npcTaskFactory.removeItem({
          item: Item.Bottles,
          count: bottles,
        }),
        npcTaskFactory.addItem({
          item: Item.Money,
          count: bottles * BOTTLE_PRICE,
        }),
      ]),
    ];
  }

  /** Сколько у NPC бутылок */
  private countBottles(state: NpcState): number {
    return state.self.inventory.get(Item.Bottles);
  }
}
