import { Observable } from '@peetland/events';

import type { ITimer } from './types';

/** Таймер, который отсчитывает настоящее время */
export class Timer implements ITimer {
  interval(period: number): Observable<number> {
    return new Observable((subscriber) => {
      const intervalId = setInterval(() => subscriber.next(period), period);
      subscriber.addTeardown(() => clearInterval(intervalId));
    });
  }
}
