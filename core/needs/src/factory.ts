import type { IReadonlyTime } from '@peetland/timings';

import { NEED_DEFINITIONS } from './definitions';
import { Need } from './need';
import { Needs } from './needs';
import type { INeeds, NeedsDeps } from './needs';
import type { NeedRecord, NeedValues } from './types';

export interface INeedsFactory {
  /**
   * Создаёт потребности с начальными значениями, которые падают с момента time (см. Needs)
   * @param values - начальное значение каждой потребности, которая есть у NPC
   * @param time - время, с которого потребности начинают падать
   */
  create(values: NeedValues, time: IReadonlyTime): INeeds;
}

export type NeedsFactoryDeps = Partial<NeedsDeps>;

export class NeedsFactory implements INeedsFactory {
  private readonly deps: NeedsDeps;

  /** @param deps - описания потребностей. По умолчанию — NEED_DEFINITIONS */
  constructor(deps: NeedsFactoryDeps = {}) {
    const { definitions = NEED_DEFINITIONS } = deps;

    this.deps = { definitions };
  }

  create(values: NeedValues, time: IReadonlyTime): INeeds {
    const since = time.getState();
    const state: Partial<Record<Need, NeedRecord>> = {};

    Object.values(Need).forEach((need) => {
      const value = values[need];
      if (value !== undefined) {
        state[need] = {
          value,
          since,
        };
      }
    });

    return new Needs(state, this.deps);
  }
}
