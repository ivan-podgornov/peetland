import type { IReadonlyTime } from '@peetland/timings';

import { Addiction } from './addiction';
import type { IAddictionFactory } from './addiction-factory';
import { BaseAddiction } from './base-addiction';
import type { IAddiction } from './base-addiction';
import type { Consumption } from './consumption';
import type { AddictionStatus } from './status';
import type { AddictionsState, AddictionSatisfactions } from './types';

/**
 * Зависимости только на чтение. Так зависимости лежат в состоянии NPC: планирование читает их, а
 * эффекты задач пишут в копию из clone(). Время передаётся при каждом чтении и записи, поэтому тяга
 * растёт в том времени, в котором её читают, в том числе во времени из клона состояния
 */
export interface IReadonlyAddictions {
  /**
   * Возвращает удовлетворённость зависимости на момент time
   * @param addiction - зависимость
   * @param time - время, на момент которого нужна удовлетворённость, обычно время из того же состояния
   */
  get(addiction: Addiction, time: IReadonlyTime): number;
  /**
   * Возвращает удовлетворённость каждой зависимости на момент time
   * @param time - время, на момент которого нужна удовлетворённость
   */
  getAll(time: IReadonlyTime): AddictionSatisfactions;
  /** Возвращает статус зависимости на момент time */
  getStatus(addiction: Addiction, time: IReadonlyTime): AddictionStatus;
  /** Возвращает, на сколько употребление поднимет удовлетворённость, без учёта пределов */
  getGain(addiction: Addiction, consumption: Consumption): number;
  /** Возвращает состояние зависимостей. Из него конструктор собирает такие же зависимости */
  getState(): AddictionsState;
  /** Возвращает копию зависимостей, в которую можно писать. Исходные зависимости копия не меняет */
  clone(): IAddictions;
}

export interface IAddictions extends IReadonlyAddictions {
  /**
   * Меняет зависимости от употребления
   * @param time - момент, когда NPC закончил употреблять
   */
  consume(consumption: Consumption, time: IReadonlyTime): void;
}

export type AddictionsDeps = {
  addictionFactory: IAddictionFactory;
};

/** Зависимости NPC */
export class Addictions implements IAddictions {
  static readonly MIN_SATISFACTION = BaseAddiction.MIN_SATISFACTION;

  static readonly MAX_SATISFACTION = BaseAddiction.MAX_SATISFACTION;

  static readonly CRAVING_BELOW = BaseAddiction.CRAVING_BELOW;

  static readonly CALM_ABOVE = BaseAddiction.CALM_ABOVE;

  static readonly MIN_STRENGTH = BaseAddiction.MIN_STRENGTH;

  static readonly MAX_STRENGTH = BaseAddiction.MAX_STRENGTH;

  private readonly deps: AddictionsDeps;
  private readonly addictions: Readonly<Record<Addiction, IAddiction>>;

  /** @throws ошибку фабрики, например если удовлетворённость вне пределов */
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

  getAll(time: IReadonlyTime): AddictionSatisfactions {
    return Object.fromEntries(
      Object.values(Addiction).map((addiction) => [addiction, this.get(addiction, time)])
    ) as AddictionSatisfactions;
  }

  getStatus(addiction: Addiction, time: IReadonlyTime): AddictionStatus {
    return this.addictions[addiction].getStatus(time);
  }

  getGain(addiction: Addiction, consumption: Consumption): number {
    return this.addictions[addiction].getGain(consumption);
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
