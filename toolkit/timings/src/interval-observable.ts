import { Observable } from '@peetland/events';

/** Раз в period миллисекунд сообщает, что прошло period миллисекунд */
export class IntervalObservable extends Observable<number> {
  constructor(period: number) {
    super((subscriber) => {
      const intervalId = setInterval(() => subscriber.next(period), period);
      subscriber.addTeardown(() => clearInterval(intervalId));
    });
  }
}
