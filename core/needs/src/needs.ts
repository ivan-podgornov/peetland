import { TimeSpan } from '@peetland/timings';
import type { IReadonlyTime } from '@peetland/timings';

import { Need } from './need';
import type { NeedDefinitions, NeedsState, NeedValues } from './types';
import type { INeedsValidator } from './validator';

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
  /** Возвращает состояние потребностей. Из него конструктор собирает такие же потребности */
  getState(): NeedsState;
  /** Возвращает копию потребностей, в которую можно писать. Исходные потребности копия не меняет */
  clone(): INeeds;
}

export interface INeeds extends IReadonlyNeeds {
  /**
   * Восполняет потребность: прибавляет amount к значению на момент time, но не выше
   * Needs.MAX_NEED, и отсчитывает падение от time. Время — момент, когда занятие закончилось.
   * Выбрасывает ошибку валидатора, если amount не прошёл проверку, и тогда потребность не меняется
   * @param need - потребность
   * @param amount - на сколько восполнить
   * @param time - момент восполнения
   */
  satisfy(need: Need, amount: number, time: IReadonlyTime): void;
}

export type NeedsDeps = {
  /** Описание каждой потребности: категория и скорость падения */
  definitions: NeedDefinitions;
  /** Проверяет значения потребностей, скорости падения и восполнения */
  validator: INeedsValidator;
};

/**
 * Потребности хранят значение каждой потребности NPC и момент, когда его выставили, а текущее
 * значение считают при чтении: значение − скорость падения × прошло игровых минут. Значение не
 * падает ниже Needs.MIN_NEED, а если время назад, не растёт. Никто не убавляет потребности по
 * тикам
 */
export class Needs implements INeeds {
  /** Минимальное значение потребности: потребность не удовлетворена совсем */
  static readonly MIN_NEED = 0;

  /** Максимальное значение потребности: потребность удовлетворена полностью */
  static readonly MAX_NEED = 100;

  private readonly deps: NeedsDeps;
  private readonly timeSpan = new TimeSpan();
  private state: NeedsState;

  /**
   * Проверяет валидатором значение и скорость падения каждой потребности и выбрасывает его ошибку,
   * если проверка не прошла
   * @param state - состояние потребностей, например восстановленное из сохранения
   */
  constructor(state: NeedsState, deps: NeedsDeps) {
    const { definitions, validator } = deps;

    Object.values(Need).forEach((need) => {
      validator.validateValue(state[need].value, Needs.MIN_NEED, Needs.MAX_NEED);
      validator.validateDepletion(definitions[need].depletionMinutes);
    });

    this.deps = deps;
    this.state = state;
  }

  get(need: Need, time: IReadonlyTime): number {
    const { definitions } = this.deps;
    const { value, since } = this.state[need];
    const elapsed = Math.max(0, this.timeSpan.elapsedMinutes(since, time.getState()));
    const rate = Needs.MAX_NEED / definitions[need].depletionMinutes;

    return Math.max(Needs.MIN_NEED, value - rate * elapsed);
  }

  getAll(time: IReadonlyTime): NeedValues {
    return Object.fromEntries(
      Object.values(Need).map((need) => [need, this.get(need, time)])
    ) as NeedValues;
  }

  getState(): NeedsState {
    return this.state;
  }

  clone(): INeeds {
    return new Needs(this.state, this.deps);
  }

  satisfy(need: Need, amount: number, time: IReadonlyTime): void {
    const { validator } = this.deps;

    validator.validateAmount(amount);
    this.state = {
      ...this.state,
      [need]: {
        value: Math.min(Needs.MAX_NEED, this.get(need, time) + amount),
        since: time.getState(),
      },
    };
  }
}
