import type { IReadonlyTime } from '@peetland/timings';

import { NEED_DEFINITIONS } from './definitions';
import { Need } from './need';
import { Needs } from './needs';
import type { INeeds, NeedsDeps } from './needs';
import type { NeedsState, NeedValues } from './types';
import { NeedsValidator } from './validator';

export interface INeedsFactory {
  /**
   * Создаёт потребности с начальными значениями, которые падают с момента time (см. Needs)
   * @param values - начальное значение каждой потребности
   * @param time - время, с которого потребности начинают падать
   */
  create(values: NeedValues, time: IReadonlyTime): INeeds;
}

export type NeedsFactoryDeps = Partial<NeedsDeps>;

export class NeedsFactory implements INeedsFactory {
  private readonly deps: NeedsDeps;

  /**
   * @param deps - описания потребностей и валидатор. По умолчанию — NEED_DEFINITIONS и
   * NeedsValidator
   */
  constructor(deps: NeedsFactoryDeps = {}) {
    const { definitions = NEED_DEFINITIONS, validator = new NeedsValidator() } = deps;

    this.deps = {
      definitions,
      validator,
    };
  }

  create(values: NeedValues, time: IReadonlyTime): INeeds {
    const since = time.getState();
    const state = Object.fromEntries(
      Object.values(Need).map((need) => [
        need,
        {
          value: values[need],
          since,
        },
      ])
    ) as NeedsState;

    return new Needs(state, this.deps);
  }
}
