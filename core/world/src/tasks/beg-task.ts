import type { CompoundTask, Method, Task } from '@peetland/htn';
import { Item } from '@peetland/inventory';
import { Deed, Feeling } from '@peetland/psyche';
import type { IPsycheFactory, PsycheState } from '@peetland/psyche';

import type { NpcContext, NpcState } from '../npc';
import { PlaceType } from '../places';
import type { IPlaces } from '../places';

import { BOOZE_PRICE } from './buy-booze-task';
import { BOTTLE_PRICE } from './sell-bottles-task';
import type { ITaskFactory } from './task-factory';

/** Шанс выклянчить деньги за одну попытку, раз в секунду (см. TryLuckTask) */
export const BEGGING_CHANCE = 1 / 40;

/** Сколько долларов NPC получает, когда удалось выклянчить */
export const BEGGING_REWARD = 10;

/**
 * Стыд, при котором NPC перестаёт клянчить. Подобран вместе с приростом стыда за попытку (см.
 * совестливость в @peetland/psyche): при средней совестливости и нулевом стартовом стыде порог
 * достигается примерно за 600 попыток. Чтобы с пустыми карманами наклянчить на пойло, в среднем
 * нужно 400 попыток, поэтому одной сессии клянчанья хватает на пойло примерно в 93% случаев
 */
export const BEGGING_SHAME_LIMIT = 60;

/** Сколько попыток, по ожиданию NPC, уйдёт на одну удачу. По нему предсказывается стыд */
export const EXPECTED_BEGGING_ATTEMPTS = 1 / BEGGING_CHANCE;

/** На каком расстоянии от места для клянчанья можно считать, что NPC до него дошёл, в метрах */
const BEGGING_SPOT_COMPLETE_RADIUS = 0.5;

/** Насколько NPC может быть отвёрнут от нужного направления, чтобы клянчить, в градусах */
const BEGGING_SPOT_FACING_TOLERANCE = 15;

export type BegTaskOptions = {
  /** Места мира. Клянчат в местах типа PlaceType.BeggingSpot */
  places: IPlaces;
};

export type BegTaskDeps = {
  taskFactory: ITaskFactory;
  /** Фабрика, которой задача собирает психику из слепка, чтобы предсказать стыд */
  psycheFactory: IPsycheFactory;
};

/**
 * Клянчить: один заход к ближайшему месту для клянчанья. NPC сидит с анимацией и раз в секунду с
 * шансом BEGGING_CHANCE получает BEGGING_REWARD, пока не наклянчит столько, сколько ему не хватает
 * на пойло вместе с деньгами и бутылками, которые у него есть. Каждая попытка, удачная или нет, —
 * поступок Deed.Begging, от которого растёт стыд. Когда стыд достигает BEGGING_SHAME_LIMIT, NPC
 * перестаёт клянчить.
 *
 * Клянчить NPC идёт, только если это окупится: по предсказанию, он успеет наклянчить на пойло до
 * того, как стыд достигнет порога. Стыд предсказывается так, будто на каждую удачу уходит
 * EXPECTED_BEGGING_ATTEMPTS попыток
 */
export class BegTask implements CompoundTask<NpcState, NpcContext> {
  readonly name = 'beg';

  readonly methods: Method<NpcState, NpcContext>[];

  private readonly places: IPlaces;
  private readonly deps: BegTaskDeps;

  constructor(options: BegTaskOptions, deps: BegTaskDeps) {
    this.places = options.places;
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
      this.countRewardsBeforeShame(state.psyche, rewards) === rewards &&
      this.places.ofType(PlaceType.BeggingSpot).length > 0
    );
  }

  /** Собирает задачи захода к ближайшему месту для клянчанья */
  private begAtNearestSpot(state: NpcState): Task<NpcState, NpcContext>[] {
    const { taskFactory } = this.deps;
    const spot = this.places.findNearest(state.actor.position, PlaceType.BeggingSpot);

    if (!spot) {
      throw new Error('Не из чего выбрать место для клянчанья');
    }

    const tasks: Task<NpcState, NpcContext>[] = [
      taskFactory.goToCoords({
        coords: spot.position,
        completeRadius: BEGGING_SPOT_COMPLETE_RADIUS,
      }),
      taskFactory.achieveAngle({ angle: spot.angle, tolerance: BEGGING_SPOT_FACING_TOLERANCE }),
    ];

    for (let index = 0; index < this.countNeededRewards(state); index++) {
      tasks.push(
        taskFactory.parallel({
          main: taskFactory.tryLuck({
            chance: BEGGING_CHANCE,
            stopWhen: (current) => this.isAshamed(current.psyche),
            onAttempt: (context) => context.psyche.react(Deed.Begging),
            applyEffects: (current) => ({ ...current, psyche: this.predictReward(current.psyche) }),
          }),
          background: taskFactory.playAnimation({ animation: 'beg-sitting' }),
        }),
        taskFactory.addItem({ item: Item.Money, count: BEGGING_REWARD })
      );
    }

    return tasks;
  }

  /**
   * Сколько удач нужно, чтобы вместе с деньгами и выручкой за бутылки хватило на пойло. Если уже
   * хватает, возвращает 0
   */
  private countNeededRewards(state: NpcState): number {
    const money = state.inventory[Item.Money] ?? 0;
    const bottles = state.inventory[Item.Bottles] ?? 0;
    const shortfall = BOOZE_PRICE - money - bottles * BOTTLE_PRICE;

    return Math.max(0, Math.ceil(shortfall / BEGGING_REWARD));
  }

  /**
   * Сколько удач, но не больше limit, успеет случиться, пока стыд, по предсказанию, не достиг
   * порога: удача случается, если перед ней стыд ещё ниже порога
   */
  private countRewardsBeforeShame(psyche: PsycheState, limit: number): number {
    let rewards = 0;
    let current = psyche;

    while (rewards < limit && !this.isAshamed(current)) {
      rewards++;
      current = this.predictReward(current);
    }

    return rewards;
  }

  /** Предсказывает психику после одной удачи: EXPECTED_BEGGING_ATTEMPTS раз клянчил */
  private predictReward(state: PsycheState): PsycheState {
    const { psycheFactory } = this.deps;
    const psyche = psycheFactory.create(state);

    for (let attempt = 0; attempt < EXPECTED_BEGGING_ATTEMPTS; attempt++) {
      psyche.react(Deed.Begging);
    }

    return psyche.getState();
  }

  private isAshamed(psyche: PsycheState): boolean {
    return psyche.feelings[Feeling.Shame] >= BEGGING_SHAME_LIMIT;
  }
}
