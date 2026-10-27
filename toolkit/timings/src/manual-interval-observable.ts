import { Observable } from '@peetland/events';
import type { ISubscriber } from '@peetland/events';

/**
 * Сообщает, что прошло время, только когда вызывают tick. Нужен в тестах: время идёт тогда,
 * когда этого хочет тест
 */
export class ManualIntervalObservable extends Observable<number> {
  private current: ISubscriber<number> | null;

  constructor() {
    super((subscriber) => {
      this.current = subscriber;
      subscriber.addTeardown(() => {
        if (this.current === subscriber) {
          this.current = null;
        }
      });
    });

    this.current = null;
  }

  /**
   * Сообщает наблюдателям, что прошло elapsed миллисекунд
   * @param elapsed - сколько миллисекунд прошло
   */
  tick(elapsed: number): void {
    this.current?.next(elapsed);
  }
}
