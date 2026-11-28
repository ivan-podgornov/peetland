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
   * Создаёт потребности с начальными значениями, которые падают с момента, который знает фабрика
   * (см. time в зависимостях фабрики)
   * @param values - начальное значение каждой потребности
   */
  create(values: NeedValues): INeeds;
}

export type NeedsFactoryDeps = {
  /** Время, с которого потребности начинают падать */
  time: IReadonlyTime;
} & Partial<
  NeedsDeps & {
    validator: INeedsValidator;
  }
>;

export class NeedsFactory implements INeedsFactory {
  private readonly deps: NeedsDeps;
  private readonly time: IReadonlyTime;

  constructor(deps: NeedsFactoryDeps) {
    const { time, validator = new NeedsValidator() } = deps;
    const { needFactory = new NeedFactory({ validator }) } = deps;

    this.time = time;
    this.deps = { needFactory };
  }

  create(values: NeedValues): INeeds {
    const since = this.time.getState();
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
