import { TimeSpan } from '@peetland/timings';
import type { IReadonlyTime } from '@peetland/timings';

import { Need } from './need';
import type { NeedDefinitions, NeedRecord, NeedsState, NeedValues } from './types';

/**
 * Потребности только на чтение. Так потребности лежат в состоянии NPC: планирование читает их, а
 * эффекты задач пишут в копию из clone(). Время передаётся при каждом чтении и записи, поэтому
 * потребности падают в том времени, в котором их читают, в том числе во времени из клона состояния
 */
export interface IReadonlyNeeds {
  /** Возвращает, есть ли потребность у NPC */
  has(need: Need): boolean;
  /**
   * Возвращает значение потребности на момент time.
   * Выбрасывает RangeError, если потребности у NPC нет
   * @param need - потребность
   * @param time - время, на момент которого нужно значение, обычно время из того же состояния
   */
  get(need: Need, time: IReadonlyTime): number;
  /**
   * Возвращает значение каждой потребности, которая есть у NPC, на момент time
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
   * Выбрасывает RangeError, если потребности у NPC нет или amount не конечное неотрицательное число
   * @param need - потребность
   * @param amount - на сколько восполнить
   * @param time - момент восполнения
   */
  satisfy(need: Need, amount: number, time: IReadonlyTime): void;
}

export type NeedsDeps = {
  /** Описание каждой потребности: категория и скорость падения */
  definitions: NeedDefinitions;
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
  private readonly records = new Map<Need, NeedRecord>();
  private readonly timeSpan = new TimeSpan();

  /**
   * Выбрасывает RangeError, если в состоянии значение потребности вне пределов или не число, или
   * если потребность в описаниях падает не за конечное положительное число минут
   * @param state - состояние потребностей, например восстановленное из сохранения
   */
  constructor(state: NeedsState, deps: NeedsDeps) {
    this.deps = deps;

    Object.values(Need).forEach((need) => {
      const record = state[need];
      if (record === undefined) {
        return;
      }

      assertValue(record.value);
      assertDepletion(deps.definitions[need].depletionMinutes);
      this.records.set(need, {
        value: record.value,
        since: { ...record.since },
      });
    });
  }

  has(need: Need): boolean {
    return this.records.has(need);
  }

  get(need: Need, time: IReadonlyTime): number {
    const { definitions } = this.deps;
    const { value, since } = this.getRecord(need);
    const elapsed = Math.max(0, this.timeSpan.elapsedMinutes(since, time.getState()));
    const rate = Needs.MAX_NEED / definitions[need].depletionMinutes;

    return Math.max(Needs.MIN_NEED, value - rate * elapsed);
  }

  getAll(time: IReadonlyTime): NeedValues {
    const values: Partial<Record<Need, number>> = {};
    this.records.forEach((_, need) => {
      values[need] = this.get(need, time);
    });
    return values;
  }

  getState(): NeedsState {
    const state: Partial<Record<Need, NeedRecord>> = {};
    this.records.forEach((record, need) => {
      state[need] = {
        value: record.value,
        since: { ...record.since },
      };
    });
    return state;
  }

  clone(): INeeds {
    return new Needs(this.getState(), this.deps);
  }

  satisfy(need: Need, amount: number, time: IReadonlyTime): void {
    assertAmount(amount);
    const current = this.get(need, time);

    this.records.set(need, {
      value: Math.min(Needs.MAX_NEED, current + amount),
      since: time.getState(),
    });
  }

  private getRecord(need: Need): NeedRecord {
    const record = this.records.get(need);
    if (record === undefined) {
      throw new RangeError(`У NPC нет потребности ${need}`);
    }

    return record;
  }
}

function assertValue(value: number): void {
  if (!Number.isFinite(value) || value < Needs.MIN_NEED || value > Needs.MAX_NEED) {
    throw new RangeError(
      `Потребность должна быть от ${Needs.MIN_NEED} до ${Needs.MAX_NEED}, получено ${value}`
    );
  }
}

function assertDepletion(minutes: number): void {
  if (!Number.isFinite(minutes) || minutes <= 0) {
    throw new RangeError(
      `Потребность должна падать за конечное положительное число минут, получено ${minutes}`
    );
  }
}

function assertAmount(amount: number): void {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new RangeError(
      `Восполнение должно быть конечным неотрицательным числом, получено ${amount}`
    );
  }
}
