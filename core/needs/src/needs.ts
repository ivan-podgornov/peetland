import { TimeSpan } from '@peetland/timings';
import type { IReadonlyTime } from '@peetland/timings';

import { Activity } from './activity';
import type { ActivityDetails } from './activity';
import { EAT_SATIETY, NEED_DEFINITIONS } from './constants';
import { Need } from './need';
import type { NeedsState, NeedValues } from './types';
import type { INeedsValidator } from './validator';

/** Вклад занятия в потребности: на сколько изменить каждую. Потребностей без изменений в объекте нет */
type NeedsContribution = Readonly<Partial<Record<Need, number>>>;

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
   * urgentBelow из описания (см. NEED_DEFINITIONS)
   * @param need - потребность
   * @param time - время, на момент которого нужна срочность, обычно время из того же состояния
   */
  isUrgent(need: Need, time: IReadonlyTime): boolean;
  /**
   * Возвращает, спокойна ли потребность на момент time: её значение выше порога calmAbove из
   * описания (см. NEED_DEFINITIONS). Срочная потребность перестаёт быть срочной, только когда стала
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
};

/**
 * Потребности хранят значение каждой потребности NPC и момент, когда его выставили, а текущее
 * значение считают при чтении: значение − скорость падения × прошло игровых минут. Скорость падения
 * берётся из NEED_DEFINITIONS. Значение не падает ниже Needs.MIN_NEED, а если время назад, не
 * растёт. Никто не убавляет потребности по тикам
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
    const { value, since } = this.state[need];
    const elapsed = Math.max(0, this.timeSpan.elapsedMinutes(since, time.getState()));
    const rate = Needs.MAX_NEED / NEED_DEFINITIONS[need].depletionMinutes;

    return Math.max(Needs.MIN_NEED, value - rate * elapsed);
  }

  getAll(time: IReadonlyTime): NeedValues {
    return Object.fromEntries(
      Object.values(Need).map((need) => [need, this.get(need, time)])
    ) as NeedValues;
  }

  isUrgent(need: Need, time: IReadonlyTime): boolean {
    return this.get(need, time) < NEED_DEFINITIONS[need].urgentBelow;
  }

  isCalm(need: Need, time: IReadonlyTime): boolean {
    return this.get(need, time) > NEED_DEFINITIONS[need].calmAbove;
  }

  getState(): NeedsState {
    return this.state;
  }

  clone(): INeeds {
    return new Needs(this.state, this.deps);
  }

  /** Детали пока не меняют вклад занятия (см. contribute) */
  perform<A extends Activity>(
    activity: A,
    _details: ActivityDetails[A],
    time: IReadonlyTime
  ): void {
    const contribution = this.contribute(activity);

    this.state = Object.values(Need).reduce<NeedsState>((state, need) => {
      const change = contribution[need];
      if (change === undefined) {
        return state;
      }

      return {
        ...state,
        [need]: {
          value: this.clamp(this.get(need, time) + change),
          since: time.getState(),
        },
      };
    }, this.state);
  }

  /**
   * Возвращает вклад занятия в потребности. Пока вклад не зависит от деталей: когда в игре появится
   * еда, от того, что съели, будет зависеть, сколько прибавится сытости
   */
  private contribute(activity: Activity): NeedsContribution {
    switch (activity) {
      case Activity.Eat:
        return { [Need.Satiety]: EAT_SATIETY };
    }
  }

  private clamp(value: number): number {
    return Math.min(Needs.MAX_NEED, Math.max(Needs.MIN_NEED, value));
  }
}
