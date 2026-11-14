import type { IReadonlyTime } from '@peetland/timings';

import { Need } from './need';
import type { IReadonlyNeeds } from './needs';

/** Следит, когда потребности становятся срочными (см. UrgencyWatcher) */
export interface IUrgencyWatcher {
  /**
   * Проверяет потребности на момент time и возвращает, стала ли с прошлой проверки срочной хоть одна
   * из них
   * @param needs - потребности, обычно из состояния NPC
   * @param time - время, на момент которого проверять, обычно из того же состояния
   */
  check(needs: IReadonlyNeeds, time: IReadonlyTime): boolean;
}

/**
 * Следит, когда потребности становятся срочными. Помнит, какие потребности горят: потребность
 * загорается, когда стала срочной (см. IReadonlyNeeds.isUrgent), и гаснет, только когда стала
 * спокойной (см. IReadonlyNeeds.isCalm). Пока потребность горит, она не загорается снова, поэтому
 * значение, которое скачет около порога срочности, не поднимает тревогу на каждой проверке. Сами
 * потребности наблюдатель не меняет
 */
export class UrgencyWatcher implements IUrgencyWatcher {
  private readonly burning = new Set<Need>();

  check(needs: IReadonlyNeeds, time: IReadonlyTime): boolean {
    let ignited = false;

    Object.values(Need).forEach((need) => {
      if (this.burning.has(need)) {
        if (needs.isCalm(need, time)) {
          this.burning.delete(need);
        }

        return;
      }

      if (needs.isUrgent(need, time)) {
        this.burning.add(need);
        ignited = true;
      }
    });

    return ignited;
  }
}

export interface IUrgencyWatcherFactory {
  /** Создаёт наблюдателя срочности, у которого ни одна потребность не горит */
  create(): IUrgencyWatcher;
}

export class UrgencyWatcherFactory implements IUrgencyWatcherFactory {
  create(): IUrgencyWatcher {
    return new UrgencyWatcher();
  }
}
