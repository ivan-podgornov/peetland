import { getTimeOfDay } from '@peetland/moonloader';
import type { ITime, TimeState } from '@peetland/timings';

/** Время суток в GTA */
export class GtaTime implements ITime {
  get hours(): number {
    const [hours] = getTimeOfDay();

    return hours;
  }

  get minutes(): number {
    const [, minutes] = getTimeOfDay();

    return minutes;
  }

  getState(): TimeState {
    const [hours, minutes] = getTimeOfDay();

    return {
      hours,
      minutes,
    };
  }
}
