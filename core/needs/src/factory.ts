import type { IReadonlyTime } from '@peetland/timings';

import { Need } from './need';
import { NeedFactory } from './need-factory';
import { Needs } from './needs';
import type { INeeds, NeedsDeps } from './needs';
import type { NeedsState, NeedValues } from './types';
import { NeedsValidator } from './validator';
import type { INeedsValidator } from './validator';

export interface INeedsFactory {
  /**
   * Создаёт потребности с начальными значениями, которые падают с момента time (см. Needs)
   * @param values - начальное значение каждой потребности
   * @param time - время, с которого потребности начинают падать
   */
  create(values: NeedValues, time: IReadonlyTime): INeeds;
}

export type NeedsFactoryDeps = Partial<
  NeedsDeps & {
    /** Проверяет значения потребностей */
    validator: INeedsValidator;
  }
>;

export class NeedsFactory implements INeedsFactory {
  private readonly deps: NeedsDeps;

  /**
   * @param deps - валидатор и фабрика потребностей. По умолчанию — NeedsValidator и NeedFactory с
   * этим валидатором
   */
  constructor(deps: NeedsFactoryDeps = {}) {
    const { validator = new NeedsValidator() } = deps;
    const { needFactory = new NeedFactory({ validator }) } = deps;

    this.deps = { needFactory };
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
