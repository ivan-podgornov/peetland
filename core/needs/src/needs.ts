import type { IReadonlyTime } from '@peetland/timings';

import type { Activity, ActivityDetails } from './activity';
import { BaseNeed } from './base-need';
import type { INeed } from './base-need';
import { Need } from './need';
import type { INeedFactory } from './need-factory';
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
  /**
   * Возвращает, срочная ли потребность на момент time: её значение ниже порога срочности
   * (см. INeed)
   * @param need - потребность
   * @param time - время, на момент которого нужна срочность, обычно время из того же состояния
   */
  isUrgent(need: Need, time: IReadonlyTime): boolean;
  /**
   * Возвращает, спокойна ли потребность на момент time: её значение выше порога calmAbove из
   * (см. INeed). Срочная потребность перестаёт быть срочной, только когда стала
   * спокойной
   * @param need - потребность
   * @param time - время, на момент которого нужно спокойствие
   */
  isCalm(need: Need, time: IReadonlyTime): boolean;
  /** Возвращает состояние потребностей. Из него конструктор собирает такие же потребности */
  getState(): NeedsState;
  /** Возвращает копию потребностей, в которую можно писать. Исходные потребности копия не меняет */
  clone(): INeeds;
}

export interface INeeds extends IReadonlyNeeds {
  /**
   * Меняет потребности от занятия: прибавляет вклад занятия к значению каждой потребности, которую
   * оно меняет, на момент time, держит значение в пределах и отсчитывает её падение от time
   * @param activity - занятие
   * @param details - детали занятия, например что съели
   * @param time - момент, когда занятие закончилось
   */
  perform<A extends Activity>(activity: A, details: ActivityDetails[A], time: IReadonlyTime): void;
}

export type NeedsDeps = {
  /** Фабрика, которой потребности собираются из состояния */
  needFactory: INeedFactory;
};

/**
 * Потребности NPC: коллекция потребностей, каждая из которых сама хранит значение, падает и
 * меняется от занятий (см. INeed). Потребности раздают им вызовы и собирают их состояние
 */
export class Needs implements INeeds {
  /** Минимальное значение потребности: потребность не удовлетворена совсем */
  static readonly MIN_NEED = BaseNeed.MIN_NEED;

  /** Максимальное значение потребности: потребность удовлетворена полностью */
  static readonly MAX_NEED = BaseNeed.MAX_NEED;

  private readonly deps: NeedsDeps;
  private readonly needs: Readonly<Record<Need, INeed>>;

  /**
   * Собирает фабрикой каждую потребность из её записи. Если фабрика выбросила ошибку, например
   * значение вне пределов, выбрасывает ту же ошибку
   * @param state - состояние потребностей, например восстановленное из сохранения
   */
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
    return this.needs[need].isUrgent(time);
  }

  isCalm(need: Need, time: IReadonlyTime): boolean {
    return this.needs[need].isCalm(time);
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
