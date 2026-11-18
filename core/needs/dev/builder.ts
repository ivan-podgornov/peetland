import { ManualTime } from '@peetland/timings';
import type { TimeState } from '@peetland/timings';

import { NeedsFactory } from '../src';
import type { Addiction, Addictions, INeeds, Need, NeedValues } from '../src';

import { createAddictions, createNeedValues } from './needs';

/**
 * Собирает потребности по шагам. То, что не задано, заполняется незначимыми значениями: все
 * потребности удовлетворены полностью с полуночи первого дня, а зависимостей нет. Каждый вызов build возвращает новые
 * потребности
 *
 * @example
 * const needs = new NeedsBuilder().withValue(Need.Satiety, 10).build();
 */
export class NeedsBuilder {
  private values: NeedValues = createNeedValues();
  private addictions: Addictions = createAddictions();
  private time: TimeState = {
    day: 1,
    hours: 0,
    minutes: 0,
  };

  /** Задаёт значение потребности */
  withValue(need: Need, value: number): this {
    this.values = {
      ...this.values,
      [need]: value,
    };
    return this;
  }

  /** Задаёт силу зависимости */
  withAddiction(addiction: Addiction, strength: number): this {
    this.addictions = {
      ...this.addictions,
      [addiction]: strength,
    };
    return this;
  }

  /** Задаёт момент, с которого потребности падают */
  withTime(time: TimeState): this {
    this.time = time;
    return this;
  }

  /** Возвращает собранные потребности */
  build(): INeeds {
    return new NeedsFactory().create(this.values, this.addictions, new ManualTime(this.time));
  }
}
