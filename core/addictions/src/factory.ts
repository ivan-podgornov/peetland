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
   * Создаёт зависимости с начальными удовлетворённостью и силой, которые падают с момента time (см.
   * Addictions)
   * @param data - начальные удовлетворённость и сила каждой зависимости
   * @param time - время, с которого растёт тяга
   */
  create(data: AddictionsData, time: IReadonlyTime): IAddictions;
}

export type AddictionsFactoryDeps = Partial<
  AddictionsDeps & {
    validator: IAddictionsValidator;
  }
>;

export class AddictionsFactory implements IAddictionsFactory {
  private readonly deps: AddictionsDeps;

  constructor(deps: AddictionsFactoryDeps = {}) {
    const { validator = new AddictionsValidator() } = deps;
    const { addictionFactory = new AddictionFactory({ validator }) } = deps;

    this.deps = { addictionFactory };
  }

  create(data: AddictionsData, time: IReadonlyTime): IAddictions {
    const since = time.getState();
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
