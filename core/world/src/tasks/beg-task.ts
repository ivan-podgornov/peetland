import type { CompoundTask, Method, Task } from '@peetland/htn';
import { Item } from '@peetland/inventory';
import { Deed, Feeling } from '@peetland/psyche';
import type { IPsycheFactory, PsycheState } from '@peetland/psyche';

import type { NpcContext, NpcState } from '../npc';
import { PlaceType } from '../places';
import type { IPlaces } from '../places';

import type { ITaskFactory } from './task-factory';

/** Шанс выклянчить деньги за одну попытку, раз в секунду (см. TryLuckTask) */
export const BEGGING_CHANCE = 1 / 40;

/** Сколько долларов NPC получает, когда удалось выклянчить */
export const BEGGING_REWARD = 10;

/** Сколько долларов NPC клянчит за один заход */
export const BEGGING_GOAL = 100;

/**
 * Стыд, при котором NPC перестаёт клянчить. Подобран вместе с приростом стыда за попытку (см.
 * совестливость в @peetland/psyche): при средней совестливости и нулевом стартовом стыде порог
 * достигается примерно за 600 попыток. На BEGGING_GOAL в среднем нужно 400 попыток, поэтому одной
 * сессии клянчанья хватает на пойло примерно в 93% случаев
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
 * шансом BEGGING_CHANCE получает BEGGING_REWARD, пока не наклянчит BEGGING_GOAL. Каждая попытка,
 * удачная или нет, — поступок Deed.Begging, от которого растёт стыд. Когда стыд достигает
 * BEGGING_SHAME_LIMIT, NPC перестаёт клянчить. При планировании стыд предсказывается так, будто на
 * каждую удачу уходит EXPECTED_BEGGING_ATTEMPTS попыток, и в план попадает столько удач, сколько
 * успеет случиться до порога стыда
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

  /** Клянчить можно, если стыд ещё не достиг порога и есть место для клянчанья */
  private canBeg(state: NpcState): boolean {
    return !this.isAshamed(state.psyche) && this.places.ofType(PlaceType.BeggingSpot).length > 0;
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

    for (let index = 0; index < this.countRewards(state.psyche); index++) {
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
   * Сколько удач попадёт в план: удача планируется, если перед ней стыд, по предсказанию, ещё не
   * достиг порога. Не больше, чем нужно на BEGGING_GOAL
   */
  private countRewards(psyche: PsycheState): number {
    let rewards = 0;
    let current = psyche;

    while (rewards < BEGGING_GOAL / BEGGING_REWARD && !this.isAshamed(current)) {
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
