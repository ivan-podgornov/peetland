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
  MAX_BEGGING_REWARDS_PER_VISIT,
} from './constants';

export type BegTaskDeps = {
  /** Места мира. Попрошайничают в местах типа PlaceType.BeggingSpot */
  places: IPlaces;
  npcTaskFactory: INpcTaskFactory;
};

/**
 * Попрошайничать: один заход к ближайшему месту для попрошайничества. NPC сидит с анимацией и раз в
 * секунду с шансом BEGGING_CHANCE получает подачку BEGGING_REWARD. Каждая попытка, удачная или нет, —
 * поступок Deed.Begging, от которого растёт стыд. Когда стыд достигает BEGGING_SHAME_LIMIT, NPC
 * перестаёт попрошайничать.
 *
 * За заход NPC планирует столько подачек, сколько, по предсказанию, успеет получить до порога стыда,
 * но не больше MAX_BEGGING_REWARDS_PER_VISIT. Если не ожидает ни одной, не идёт. Стыд предсказывается
 * так, будто на каждую подачку уходит столько попыток, сколько NPC ожидает при шансе BEGGING_CHANCE:
 * оптимист рассчитывает на меньшее число попыток, пессимист — на большее
 */
export class BegTask implements CompoundTask<NpcState, NpcContext> {
  /** На каком расстоянии от места для попрошайничества можно считать, что NPC до него дошёл, в метрах */
  private static readonly SPOT_COMPLETE_RADIUS = 0.5;

  /** Насколько NPC может быть отвёрнут от нужного направления, чтобы попрошайничать, в градусах */
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
   * Попрошайничать стоит, если до порога стыда NPC успеет получить хотя бы одну подачку и есть место
   * для попрошайничества
   */
  private canBeg(state: NpcState): boolean {
    return (
      this.countRewards(state.self.psyche) > 0 &&
      this.places.ofType(PlaceType.BeggingSpot).length > 0
    );
  }

  /** Собирает задачи захода к ближайшему месту для попрошайничества */
  private begAtNearestSpot(state: NpcState): Task<NpcState, NpcContext>[] {
    const { npcTaskFactory } = this.deps;
    const spot = this.places.findNearest(state.self.actor.position, PlaceType.BeggingSpot);

    if (!spot) {
      throw new Error('Не из чего выбрать место для попрошайничества');
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

    for (let index = 0; index < this.countRewards(state.self.psyche); index++) {
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
   * Сколько подачек, но не больше MAX_BEGGING_REWARDS_PER_VISIT, NPC, по предсказанию, успеет
   * получить до порога стыда: подачка успевает, если после попыток, которые NPC на неё ожидает, стыд
   * ещё ниже порога
   */
  private countRewards(psyche: IReadonlyPsyche): number {
    let rewards = 0;
    let current = this.predictReward(psyche);

    while (rewards < MAX_BEGGING_REWARDS_PER_VISIT && !this.isAshamed(current)) {
      rewards++;
      current = this.predictReward(current);
    }

    return rewards;
  }

  /**
   * Предсказывает психику после одной подачки: попрошайничал столько раз, сколько NPC ожидает до
   * подачки. Возвращает копию психики, а переданную не меняет
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
