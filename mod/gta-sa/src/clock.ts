import { getTimeOfDay } from '@peetland/moonloader';
import type { IClock } from '@peetland/timings';

/** Часы, которые показывают игровое время суток GTA */
export class GtaClock implements IClock {
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
