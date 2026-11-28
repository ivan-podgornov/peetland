import type { IReadonlyTime } from '@peetland/timings';

import { Addiction } from './addiction';
import { AddictionFactory } from './addiction-factory';
import { Addictions } from './addictions';
import type { IAddictions, AddictionsDeps } from './addictions';
import type { AddictionsData, AddictionsState } from './types';
import { AddictionsValidator } from './validator';
import type { IAddictionsValidator } from './validator';

export interface IAddictionsFactory {
  /**
   * Создаёт зависимости с начальными удовлетворённостью и силой, которые падают с момента, который
   * знает фабрика (см. time в зависимостях фабрики)
   * @param data - начальные удовлетворённость и сила каждой зависимости
   */
  create(data: AddictionsData): IAddictions;
}

export type AddictionsFactoryDeps = {
  /** Время, с которого растёт тяга */
  time: IReadonlyTime;
} & Partial<
  AddictionsDeps & {
    validator: IAddictionsValidator;
  }
>;

export class AddictionsFactory implements IAddictionsFactory {
  private readonly deps: AddictionsDeps;
  private readonly time: IReadonlyTime;

  constructor(deps: AddictionsFactoryDeps) {
    const { time, validator = new AddictionsValidator() } = deps;
    const { addictionFactory = new AddictionFactory({ validator }) } = deps;

    this.time = time;
    this.deps = { addictionFactory };
  }

  create(data: AddictionsData): IAddictions {
    const since = this.time.getState();
    const state = Object.fromEntries(
      Object.values(Addiction).map((addiction) => [
        addiction,
        {
          ...data[addiction],
          since,
        },
      ])
    ) as AddictionsState;

    return new Addictions(state, this.deps);
  }
}
