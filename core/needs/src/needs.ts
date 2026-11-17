import type { IReadonlyTime } from '@peetland/timings';

import type { Activity, ActivityDetails } from './activity';
import { BaseNeed } from './base-need';
import type { INeed } from './base-need';
import { Need } from './need';
import type { INeedFactory } from './need-factory';
import { NeedStatus } from './status';
import type { NeedsState, NeedValues } from './types';

/**
 * Потребности только на чтение. Так потребности лежат в состоянии NPC: планирование читает их, а
 * эффекты задач пишут в копию из clone(). Время передаётся при каждом чтении и записи, поэтому
 * потребности падают в том времени, в котором их читают, в том числе во времени из клона состояния
 */
export interface IReadonlyNeeds {
  /**
   * Возвращает значение потребности на момент time
   * @param need - потребность
   * @param time - время, на момент которого нужно значение, обычно время из того же состояния
   */
  get(need: Need, time: IReadonlyTime): number;
  /**
   * Возвращает значение каждой потребности на момент time
   * @param time - время, на момент которого нужны значения
   */
  getAll(time: IReadonlyTime): NeedValues;
  /** Возвращает, срочная ли потребность на момент time (см. NeedStatus) */
  isUrgent(need: Need, time: IReadonlyTime): boolean;
  /** Возвращает, спокойна ли потребность на момент time (см. NeedStatus) */
  isCalm(need: Need, time: IReadonlyTime): boolean;
  /** Возвращает состояние потребностей. Из него конструктор собирает такие же потребности */
  getState(): NeedsState;
  /** Возвращает копию потребностей, в которую можно писать. Исходные потребности копия не меняет */
  clone(): INeeds;
}

export interface INeeds extends IReadonlyNeeds {
  /**
   * Меняет потребности от занятия
   * @param time - момент, когда занятие закончилось
   */
  perform<A extends Activity>(activity: A, details: ActivityDetails[A], time: IReadonlyTime): void;
}

export type NeedsDeps = {
  needFactory: INeedFactory;
};

/** Потребности NPC */
export class Needs implements INeeds {
  static readonly MIN_NEED = BaseNeed.MIN_NEED;

  static readonly MAX_NEED = BaseNeed.MAX_NEED;

  private readonly deps: NeedsDeps;
  private readonly needs: Readonly<Record<Need, INeed>>;

  /** @throws ошибку фабрики, например если значение вне пределов */
  constructor(state: NeedsState, deps: NeedsDeps) {
    const { needFactory } = deps;

    this.deps = deps;
    this.needs = Object.fromEntries(
      Object.values(Need).map((need) => [need, needFactory.create(need, state[need])])
    ) as Record<Need, INeed>;
  }

  get(need: Need, time: IReadonlyTime): number {
    return this.needs[need].get(time);
  }

  getAll(time: IReadonlyTime): NeedValues {
    return Object.fromEntries(
      Object.values(Need).map((need) => [need, this.get(need, time)])
    ) as NeedValues;
  }

  isUrgent(need: Need, time: IReadonlyTime): boolean {
    return this.needs[need].getStatus(time) === NeedStatus.Urgent;
  }

  isCalm(need: Need, time: IReadonlyTime): boolean {
    return this.needs[need].getStatus(time) === NeedStatus.Calm;
  }

  getState(): NeedsState {
    return Object.fromEntries(
      Object.values(Need).map((need) => [need, this.needs[need].getState()])
    ) as NeedsState;
  }

  clone(): INeeds {
    return new Needs(this.getState(), this.deps);
  }

  perform<A extends Activity>(activity: A, details: ActivityDetails[A], time: IReadonlyTime): void {
    Object.values(Need).forEach((need) => this.needs[need].perform(activity, details, time));
  }
}
