import type { IReadonlyTime } from '@peetland/timings';

import type { Activity } from './activity';
import { Addiction } from './addiction';
import type { IAddictionFactory } from './addiction-factory';
import { BaseAddiction } from './base-addiction';
import type { IAddiction } from './base-addiction';
import type { AddictionStatus } from './status';
import type { AddictionsState, AddictionValues } from './types';

/**
 * Зависимости только на чтение. Так зависимости лежат в состоянии NPC: планирование читает их, а
 * эффекты задач пишут в копию из clone(). Время передаётся при каждом чтении и записи, поэтому тяга
 * растёт в том времени, в котором её читают, в том числе во времени из клона состояния
 */
export interface IReadonlyAddictions {
  /**
   * Возвращает значение зависимости на момент time
   * @param addiction - зависимость
   * @param time - время, на момент которого нужно значение, обычно время из того же состояния
   */
  get(addiction: Addiction, time: IReadonlyTime): number;
  /**
   * Возвращает значение каждой зависимости на момент time
   * @param time - время, на момент которого нужны значения
   */
  getAll(time: IReadonlyTime): AddictionValues;
  /** Возвращает статус зависимости на момент time */
  getStatus(addiction: Addiction, time: IReadonlyTime): AddictionStatus;
  /** Возвращает, на сколько занятие изменит зависимость, без учёта пределов */
  getGain(addiction: Addiction, activity: Activity): number;
  /** Возвращает состояние зависимостей. Из него конструктор собирает такие же зависимости */
  getState(): AddictionsState;
  /** Возвращает копию зависимостей, в которую можно писать. Исходные зависимости копия не меняет */
  clone(): IAddictions;
}

export interface IAddictions extends IReadonlyAddictions {
  /**
   * Меняет зависимости от занятия
   * @param time - момент, когда занятие закончилось
   */
  perform(activity: Activity, time: IReadonlyTime): void;
}

export type AddictionsDeps = {
  addictionFactory: IAddictionFactory;
};

/** Зависимости NPC */
export class Addictions implements IAddictions {
  static readonly MIN_VALUE = BaseAddiction.MIN_VALUE;

  static readonly MAX_VALUE = BaseAddiction.MAX_VALUE;

  static readonly URGENT_BELOW = BaseAddiction.URGENT_BELOW;

  static readonly CALM_ABOVE = BaseAddiction.CALM_ABOVE;

  static readonly MIN_STRENGTH = BaseAddiction.MIN_STRENGTH;

  static readonly MAX_STRENGTH = BaseAddiction.MAX_STRENGTH;

  private readonly deps: AddictionsDeps;
  private readonly addictions: Readonly<Record<Addiction, IAddiction>>;

  /** @throws ошибку фабрики, например если значение вне пределов */
  constructor(state: AddictionsState, deps: AddictionsDeps) {
    const { addictionFactory } = deps;

    this.deps = deps;
    this.addictions = Object.fromEntries(
      Object.values(Addiction).map((addiction) => [
        addiction,
        addictionFactory.create(addiction, state[addiction]),
      ])
    ) as Record<Addiction, IAddiction>;
  }

  get(addiction: Addiction, time: IReadonlyTime): number {
    return this.addictions[addiction].get(time);
  }

  getAll(time: IReadonlyTime): AddictionValues {
    return Object.fromEntries(
      Object.values(Addiction).map((addiction) => [addiction, this.get(addiction, time)])
    ) as AddictionValues;
  }

  getStatus(addiction: Addiction, time: IReadonlyTime): AddictionStatus {
    return this.addictions[addiction].getStatus(time);
  }

  getGain(addiction: Addiction, activity: Activity): number {
    return this.addictions[addiction].getGain(activity);
  }

  getState(): AddictionsState {
    return Object.fromEntries(
      Object.values(Addiction).map((addiction) => [
        addiction,
        this.addictions[addiction].getState(),
      ])
    ) as AddictionsState;
  }

  clone(): IAddictions {
    return new Addictions(this.getState(), this.deps);
  }

  perform(activity: Activity, time: IReadonlyTime): void {
    Object.values(Addiction).forEach((addiction) =>
      this.addictions[addiction].perform(activity, time)
    );
  }
}
