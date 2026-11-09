import type { CompoundTask, Method, Task } from '@peetland/htn';
import { Item } from '@peetland/inventory';
import type { NpcContext, NpcState } from '@peetland/npc';
import type { INpcTaskFactory } from '@peetland/npc-tasks';
import { PlaceType } from '@peetland/places';
import type { IPlaces } from '@peetland/places';
import { Deed, Feeling } from '@peetland/psyche';
import type { IPsyche, IReadonlyPsyche } from '@peetland/psyche';

import {
  BEGGING_CHANCE,
  BEGGING_REWARD,
  BEGGING_SHAME_LIMIT,
  BOOZE_PRICE,
  BOTTLE_PRICE,
} from './constants';

export type BegTaskDeps = {
  /** Места мира. Клянчат в местах типа PlaceType.BeggingSpot */
  places: IPlaces;
  npcTaskFactory: INpcTaskFactory;
};

/**
 * Клянчить: один заход к ближайшему месту для клянчанья. NPC сидит с анимацией и раз в секунду с
 * шансом BEGGING_CHANCE получает BEGGING_REWARD, пока не наклянчит столько, сколько ему не хватает
 * на пойло вместе с деньгами и бутылками, которые у него есть. Каждая попытка, удачная или нет, —
 * поступок Deed.Begging, от которого растёт стыд. Когда стыд достигает BEGGING_SHAME_LIMIT, NPC
 * перестаёт клянчить.
 *
 * Клянчить NPC идёт, только если это окупится: по предсказанию, он успеет наклянчить на пойло до
 * того, как стыд достигнет порога. Стыд предсказывается так, будто на каждую удачу уходит столько
 * попыток, сколько NPC ожидает при шансе BEGGING_CHANCE: оптимист рассчитывает на меньшее число
 * попыток, пессимист — на большее
 */
export class BegTask implements CompoundTask<NpcState, NpcContext> {
  /** На каком расстоянии от места для клянчанья можно считать, что NPC до него дошёл, в метрах */
  private static readonly SPOT_COMPLETE_RADIUS = 0.5;

  /** Насколько NPC может быть отвёрнут от нужного направления, чтобы клянчить, в градусах */
  private static readonly SPOT_FACING_TOLERANCE = 15;

  readonly name = 'beg';

  readonly methods: Method<NpcState, NpcContext>[];

  private readonly places: IPlaces;
  private readonly deps: BegTaskDeps;

  constructor(deps: BegTaskDeps) {
    this.places = deps.places;
    this.deps = deps;
    this.methods = [
      {
        name: 'beg-at-nearest-spot',
        preconditions: (state) => this.canBeg(state),
        tasks: (state) => this.begAtNearestSpot(state),
      },
    ];
  }

  /**
   * Клянчить стоит, если на пойло не хватает, до порога стыда NPC успеет наклянчить, сколько не
   * хватает, и есть место для клянчанья
   */
  private canBeg(state: NpcState): boolean {
    const rewards = this.countNeededRewards(state);

    return (
      rewards > 0 &&
      this.countRewardsBeforeShame(state.self.psyche, rewards) === rewards &&
      this.places.ofType(PlaceType.BeggingSpot).length > 0
    );
  }

  /** Собирает задачи захода к ближайшему месту для клянчанья */
  private begAtNearestSpot(state: NpcState): Task<NpcState, NpcContext>[] {
    const { npcTaskFactory } = this.deps;
    const spot = this.places.findNearest(state.self.actor.position, PlaceType.BeggingSpot);

    if (!spot) {
      throw new Error('Не из чего выбрать место для клянчанья');
    }

    const tasks: Task<NpcState, NpcContext>[] = [
      npcTaskFactory.goToCoords({
        coords: spot.position,
        completeRadius: BegTask.SPOT_COMPLETE_RADIUS,
      }),
      npcTaskFactory.achieveAngle({
        angle: spot.angle,
        tolerance: BegTask.SPOT_FACING_TOLERANCE,
      }),
    ];

    for (let index = 0; index < this.countNeededRewards(state); index++) {
      tasks.push(
        npcTaskFactory.parallel({
          main: npcTaskFactory.tryLuck({
            chance: BEGGING_CHANCE,
            stopWhen: (current) => this.isAshamed(current.self.psyche),
            onAttempt: (context) => context.psyche.react(Deed.Begging),
            applyEffects: (current) => ({
              ...current,
              self: {
                ...current.self,
                psyche: this.predictReward(current.self.psyche),
              },
            }),
          }),
          background: npcTaskFactory.playAnimation({ animation: 'beg-sitting' }),
        }),
        npcTaskFactory.addItem({
          item: Item.Money,
          count: BEGGING_REWARD,
        })
      );
    }

    return tasks;
  }

  /**
   * Сколько удач нужно, чтобы вместе с деньгами и выручкой за бутылки хватило на пойло. Если уже
   * хватает, возвращает 0
   */
  private countNeededRewards(state: NpcState): number {
    const money = state.self.inventory.get(Item.Money);
    const bottles = state.self.inventory.get(Item.Bottles);
    const shortfall = BOOZE_PRICE - money - bottles * BOTTLE_PRICE;

    return Math.max(0, Math.ceil(shortfall / BEGGING_REWARD));
  }

  /**
   * Сколько удач, но не больше limit, успеет случиться, пока стыд, по предсказанию, не достиг
   * порога: удача случается, если перед ней стыд ещё ниже порога
   */
  private countRewardsBeforeShame(psyche: IReadonlyPsyche, limit: number): number {
    let rewards = 0;
    let current = psyche;

    while (rewards < limit && !this.isAshamed(current)) {
      rewards++;
      current = this.predictReward(current);
    }

    return rewards;
  }

  /**
   * Предсказывает психику после одной удачи: клянчил столько раз, сколько NPC ожидает до удачи.
   * Возвращает копию психики, а переданную не меняет
   */
  private predictReward(current: IReadonlyPsyche): IPsyche {
    const psyche = current.clone();
    const attempts = psyche.expectAttempts(BEGGING_CHANCE);

    for (let attempt = 0; attempt < attempts; attempt++) {
      psyche.react(Deed.Begging);
    }

    return psyche;
  }

  private isAshamed(psyche: IReadonlyPsyche): boolean {
    return psyche.getState().feelings[Feeling.Shame] >= BEGGING_SHAME_LIMIT;
  }
}
