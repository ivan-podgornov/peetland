import { Observable } from '@peetland/events';
import type { ISubscriber } from '@peetland/events';

import type { ITimer } from './types';

type ManualInterval = {
  period: number;
  /** Время, когда интервал выдаст следующее значение */
  nextAt: number;
  subscriber: ISubscriber<number>;
};

/**
 * Таймер, время которого идёт, только когда вызывают advance. Нужен в тестах: время идёт тогда,
 * когда этого хочет тест
 */
export class ManualTimer implements ITimer {
  private now: number;
  private readonly intervals: Set<ManualInterval>;

  constructor() {
    this.now = 0;
    this.intervals = new Set();
  }

  /**
   * Выбрасывает RangeError, если period не положительное конечное число
   * @inheritdoc
   */
  interval(period: number): Observable<number> {
    if (!Number.isFinite(period) || period <= 0) {
      throw new RangeError('Период интервала должен быть положительным конечным числом');
    }

    return new Observable((subscriber) => {
      const interval: ManualInterval = { period, nextAt: this.now + period, subscriber };

      this.intervals.add(interval);
      subscriber.addTeardown(() => this.intervals.delete(interval));
    });
  }

  /**
   * Продвигает время на ms миллисекунд. Интервалы, для которых за это время подошёл срок, выдают
   * значения в том порядке, в котором подошёл их срок.
   * Выбрасывает RangeError, если ms отрицательное или не конечное число
   * @param ms - на сколько миллисекунд продвинуть время
   */
  advance(ms: number): void {
    if (!Number.isFinite(ms) || ms < 0) {
      throw new RangeError('Время можно продвинуть только на неотрицательное конечное число');
    }

    const target = this.now + ms;
    let interval = this.findNextInterval(target);

    while (interval) {
      this.now = interval.nextAt;
      interval.nextAt += interval.period;
      interval.subscriber.next(interval.period);
      interval = this.findNextInterval(target);
    }

    this.now = target;
  }

  /** Возвращает интервал, срок которого подойдёт раньше всех, но не позже until */
  private findNextInterval(until: number): ManualInterval | null {
    let next: ManualInterval | null = null;

    for (const interval of this.intervals) {
      if (interval.nextAt <= until && (!next || interval.nextAt < next.nextAt)) {
        next = interval;
      }
    }

    return next;
  }
}
