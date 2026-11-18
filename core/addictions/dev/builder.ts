import { ManualTime } from '@peetland/timings';
import type { TimeState } from '@peetland/timings';

import { AddictionsFactory } from '../src';
import type { Addiction, AddictionsData, IAddictions } from '../src';

import { createAddictionsData } from './addictions';

/**
 * Собирает зависимости по шагам. То, что не задано, заполняется незначимыми значениями: зависимостей
 * нет, и с полуночи первого дня тяги нет. Каждый вызов build возвращает новые зависимости
 *
 * @example
 * const addictions = new AddictionsBuilder()
 *   .withStrength(Addiction.Alcoholism, 100)
 *   .withCraving(Addiction.Alcoholism, 80)
 *   .build();
 */
export class AddictionsBuilder {
  private data: AddictionsData = createAddictionsData();
  private time: TimeState = {
    day: 1,
    hours: 0,
    minutes: 0,
  };

  /** Задаёт тягу зависимости */
  withCraving(addiction: Addiction, craving: number): this {
    this.data = {
      ...this.data,
      [addiction]: {
        ...this.data[addiction],
        craving,
      },
    };
    return this;
  }

  /** Задаёт силу зависимости */
  withStrength(addiction: Addiction, strength: number): this {
    this.data = {
      ...this.data,
      [addiction]: {
        ...this.data[addiction],
        strength,
      },
    };
    return this;
  }

  /** Задаёт момент, с которого растёт тяга */
  withTime(time: TimeState): this {
    this.time = time;
    return this;
  }

  /** Возвращает собранные зависимости */
  build(): IAddictions {
    return new AddictionsFactory().create(this.data, new ManualTime(this.time));
  }
}
