import { getTimeOfDay } from '@peetland/moonloader';
import type { ITime } from '@peetland/timings';

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

  get minutesSinceMidnight(): number {
    const [hours, minutes] = getTimeOfDay();

    return hours * 60 + minutes;
  }
}
