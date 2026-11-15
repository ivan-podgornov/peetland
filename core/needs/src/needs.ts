import type { IReadonlyTime } from '@peetland/timings';

import type { Activity, ActivityDetails } from './activity';
import { Need } from './need';
import { NeedModel } from './need-model';
import type { INeedModel } from './need-model';
import type { NeedsState, NeedValues } from './types';
import type { INeedsValidator } from './validator';

/** Модель каждой потребности */
export type NeedModels = Readonly<Record<Need, INeedModel>>;

/**
 * Потребности только на чтение. Так потребности лежат в состоянии NPC: планирование читает их, а
 * эффекты задач пишут в копию из clone(). Время передаётся при каждом чтении и записи, поэтому
 * потребности падают в том времени, в котором их читают, в том числе во времени из клона состояния
 */
export interface IReadonlyNeeds {
  /**
   * Возвращает значение потребности на момент time
   * @param need - потребность
   * @param time - время, на момент которого нужно значение, обычно время из того же состояния
   */
  get(need: Need, time: IReadonlyTime): number;
  /**
   * Возвращает значение каждой потребности на момент time
   * @param time - время, на момент которого нужны значения
   */
  getAll(time: IReadonlyTime): NeedValues;
  /**
   * Возвращает, срочная ли потребность на момент time: её значение ниже порога срочности
   * urgentBelow её модели (см. INeedModel)
   * @param need - потребность
   * @param time - время, на момент которого нужна срочность, обычно время из того же состояния
   */
  isUrgent(need: Need, time: IReadonlyTime): boolean;
  /**
   * Возвращает, спокойна ли потребность на момент time: её значение выше порога calmAbove из
   * её модели (см. INeedModel). Срочная потребность перестаёт быть срочной, только когда стала
   * спокойной
   * @param need - потребность
   * @param time - время, на момент которого нужно спокойствие
   */
  isCalm(need: Need, time: IReadonlyTime): boolean;
  /** Возвращает состояние потребностей. Из него конструктор собирает такие же потребности */
  getState(): NeedsState;
  /** Возвращает копию потребностей, в которую можно писать. Исходные потребности копия не меняет */
  clone(): INeeds;
}

export interface INeeds extends IReadonlyNeeds {
  /**
   * Меняет потребности от занятия: прибавляет вклад занятия к значению каждой потребности, которую
   * оно меняет, на момент time, держит значение в пределах и отсчитывает её падение от time
   * @param activity - занятие
   * @param details - детали занятия, например что съели
   * @param time - момент, когда занятие закончилось
   */
  perform<A extends Activity>(activity: A, details: ActivityDetails[A], time: IReadonlyTime): void;
}

export type NeedsDeps = {
  /** Проверяет значения потребностей */
  validator: INeedsValidator;
  /** Модели потребностей: как каждая падает, когда срочная и как её меняют занятия */
  models: NeedModels;
};

/**
 * Потребности хранят значение каждой потребности NPC и момент, когда его выставили, а текущее
 * значение, срочность и вклад занятий считают модели потребностей (см. INeedModel). Никто не
 * убавляет потребности по тикам
 */
export class Needs implements INeeds {
  /** Минимальное значение потребности: потребность не удовлетворена совсем */
  static readonly MIN_NEED = NeedModel.MIN_NEED;

  /** Максимальное значение потребности: потребность удовлетворена полностью */
  static readonly MAX_NEED = NeedModel.MAX_NEED;

  private readonly deps: NeedsDeps;
  private state: NeedsState;

  /**
   * Проверяет валидатором значение каждой потребности и выбрасывает его ошибку, если проверка не
   * прошла
   * @param state - состояние потребностей, например восстановленное из сохранения
   */
  constructor(state: NeedsState, deps: NeedsDeps) {
    const { validator } = deps;

    Object.values(Need).forEach((need) =>
      validator.validateValue(state[need].value, Needs.MIN_NEED, Needs.MAX_NEED)
    );

    this.deps = deps;
    this.state = state;
  }

  get(need: Need, time: IReadonlyTime): number {
    const { models } = this.deps;

    return models[need].get(this.state[need], time);
  }

  getAll(time: IReadonlyTime): NeedValues {
    return Object.fromEntries(
      Object.values(Need).map((need) => [need, this.get(need, time)])
    ) as NeedValues;
  }

  isUrgent(need: Need, time: IReadonlyTime): boolean {
    const { models } = this.deps;

    return models[need].isUrgent(this.state[need], time);
  }

  isCalm(need: Need, time: IReadonlyTime): boolean {
    const { models } = this.deps;

    return models[need].isCalm(this.state[need], time);
  }

  getState(): NeedsState {
    return this.state;
  }

  clone(): INeeds {
    return new Needs(this.state, this.deps);
  }

  perform<A extends Activity>(activity: A, details: ActivityDetails[A], time: IReadonlyTime): void {
    const { models } = this.deps;

    this.state = Object.fromEntries(
      Object.values(Need).map((need) => [
        need,
        models[need].perform(this.state[need], activity, details, time),
      ])
    ) as NeedsState;
  }
}
