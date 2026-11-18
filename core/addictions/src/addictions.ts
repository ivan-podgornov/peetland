import type { IReadonlyTime } from '@peetland/timings';

import { Addiction } from './addiction';
import type { IAddictionFactory } from './addiction-factory';
import { BaseAddiction } from './base-addiction';
import type { IAddiction } from './base-addiction';
import type { Consumption } from './consumption';
import type { AddictionStatus } from './status';
import type { AddictionsState, AddictionCravings } from './types';

/**
 * Зависимости только на чтение. Так зависимости лежат в состоянии NPC: планирование читает их, а
 * эффекты задач пишут в копию из clone(). Время передаётся при каждом чтении и записи, поэтому тяга
 * растёт в том времени, в котором её читают, в том числе во времени из клона состояния
 */
export interface IReadonlyAddictions {
  /**
   * Возвращает тягу зависимости на момент time
   * @param addiction - зависимость
   * @param time - время, на момент которого нужна тяга, обычно время из того же состояния
   */
  get(addiction: Addiction, time: IReadonlyTime): number;
  /**
   * Возвращает тягу каждой зависимости на момент time
   * @param time - время, на момент которого нужна тяга
   */
  getAll(time: IReadonlyTime): AddictionCravings;
  /** Возвращает статус зависимости на момент time */
  getStatus(addiction: Addiction, time: IReadonlyTime): AddictionStatus;
  /** Возвращает, на сколько употребление снимет тягу зависимости, без учёта пределов */
  getRelief(addiction: Addiction, consumption: Consumption): number;
  /** Возвращает состояние зависимостей. Из него конструктор собирает такие же зависимости */
  getState(): AddictionsState;
  /** Возвращает копию зависимостей, в которую можно писать. Исходные зависимости копия не меняет */
  clone(): IAddictions;
}

export interface IAddictions extends IReadonlyAddictions {
  /**
   * Снимает тягу от употребления
   * @param time - момент, когда NPC закончил употреблять
   */
  consume(consumption: Consumption, time: IReadonlyTime): void;
}

export type AddictionsDeps = {
  addictionFactory: IAddictionFactory;
};

/** Зависимости NPC */
export class Addictions implements IAddictions {
  static readonly MIN_CRAVING = BaseAddiction.MIN_CRAVING;

  static readonly MAX_CRAVING = BaseAddiction.MAX_CRAVING;

  static readonly CRAVING_ABOVE = BaseAddiction.CRAVING_ABOVE;

  static readonly CALM_BELOW = BaseAddiction.CALM_BELOW;

  static readonly MIN_STRENGTH = BaseAddiction.MIN_STRENGTH;

  static readonly MAX_STRENGTH = BaseAddiction.MAX_STRENGTH;

  private readonly deps: AddictionsDeps;
  private readonly addictions: Readonly<Record<Addiction, IAddiction>>;

  /** @throws ошибку фабрики, например если тяга вне пределов */
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

  getAll(time: IReadonlyTime): AddictionCravings {
    return Object.fromEntries(
      Object.values(Addiction).map((addiction) => [addiction, this.get(addiction, time)])
    ) as AddictionCravings;
  }

  getStatus(addiction: Addiction, time: IReadonlyTime): AddictionStatus {
    return this.addictions[addiction].getStatus(time);
  }

  getRelief(addiction: Addiction, consumption: Consumption): number {
    return this.addictions[addiction].getRelief(consumption);
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

  consume(consumption: Consumption, time: IReadonlyTime): void {
    Object.values(Addiction).forEach((addiction) =>
      this.addictions[addiction].consume(consumption, time)
    );
  }
}
