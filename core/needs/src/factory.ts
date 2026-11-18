import type { IReadonlyTime } from '@peetland/timings';

import { Need } from './need';
import { NeedFactory } from './need-factory';
import { Needs } from './needs';
import type { INeeds, NeedsDeps } from './needs';
import type { Addictions, NeedsState, NeedValues } from './types';
import { NeedsValidator } from './validator';
import type { INeedsValidator } from './validator';

export interface INeedsFactory {
  /**
   * Создаёт потребности с начальными значениями, которые падают с момента time (см. Needs)
   * @param values - начальное значение каждой потребности
   * @param addictions - сила каждой зависимости
   * @param time - время, с которого потребности начинают падать
   */
  create(values: NeedValues, addictions: Addictions, time: IReadonlyTime): INeeds;
}

export type NeedsFactoryDeps = Partial<
  NeedsDeps & {
    validator: INeedsValidator;
  }
>;

export class NeedsFactory implements INeedsFactory {
  private readonly deps: NeedsDeps;

  constructor(deps: NeedsFactoryDeps = {}) {
    const { validator = new NeedsValidator() } = deps;
    const { needFactory = new NeedFactory({ validator }) } = deps;

    this.deps = { needFactory };
  }

  create(values: NeedValues, addictions: Addictions, time: IReadonlyTime): INeeds {
    const since = time.getState();
    const state: NeedsState = {
      [Need.Satiety]: {
        value: values[Need.Satiety],
        since,
      },
      [Need.Alcoholism]: {
        value: values[Need.Alcoholism],
        since,
        strength: addictions[Need.Alcoholism],
      },
    };

    return new Needs(state, this.deps);
  }
}
