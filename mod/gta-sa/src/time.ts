import type { Observable } from '@peetland/events';
import { getTimeOfDay } from '@peetland/moonloader';
import { ManualTime } from '@peetland/timings';
import type { IManualTime, ITime, TimeState } from '@peetland/timings';

export type GtaTimeDeps = {
  /** Тики мира, на которых время замечает, что наступила полночь */
  ticks: Observable<unknown>;
};

/**
 * Время GTA. Часы и минуты берутся из игры, а дни игра не считает, поэтому их считает время: каждый
 * тик и при каждом чтении сверяется с игрой и, если час стал меньше прошлого, значит наступила
 * полночь. Считается, что за один тик игровое время не уходит вперёд на сутки
 */
export class GtaTime implements ITime {
  private state: TimeState;

  constructor(deps: GtaTimeDeps) {
    const [hours, minutes] = getTimeOfDay();
    this.state = {
      day: 1,
      hours,
      minutes,
    };

    deps.ticks.subscribe(() => this.sync());
  }

  get day(): number {
    return this.getState().day;
  }

  get hours(): number {
    return this.getState().hours;
  }

  get minutes(): number {
    return this.getState().minutes;
  }

  getState(): TimeState {
    this.sync();

    const { day, hours, minutes } = this.state;

    return {
      day,
      hours,
      minutes,
    };
  }

  clone(): IManualTime {
    return new ManualTime(this.getState());
  }

  /** Берёт часы и минуты из игры и, если наступила полночь, переходит на следующий день */
  private sync(): void {
    const [hours, minutes] = getTimeOfDay();
    const day = hours < this.state.hours ? this.state.day + 1 : this.state.day;

    this.state = {
      day,
      hours,
      minutes,
    };
  }
}
