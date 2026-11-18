import type { IReadonlyTime } from '@peetland/timings';

import { NeedCategory } from './category';
import { Need } from './need';
import type { IReadonlyNeeds } from './needs';
import { NeedStatus } from './status';

/** Следит, когда жизненные потребности становятся срочными (см. UrgencyWatcher) */
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
 * Следит, когда жизненные потребности становятся срочными. Зависимости не следит: тяга не прерывает
 * текущий план, а дожидается следующего планирования. Помнит, какие потребности горят: потребность
 * загорается, когда стала срочной (NeedStatus.Urgent), и гаснет, только когда стала
 * спокойной (NeedStatus.Calm). Пока потребность горит, она не загорается снова, поэтому
 * значение, которое скачет около порога срочности, не поднимает тревогу на каждой проверке. Сами
 * потребности наблюдатель не меняет
 */
export class UrgencyWatcher implements IUrgencyWatcher {
  private readonly burning = new Set<Need>();

  check(needs: IReadonlyNeeds, time: IReadonlyTime): boolean {
    let ignited = false;

    Object.values(Need).forEach((need) => {
      if (needs.getCategory(need) !== NeedCategory.Vital) {
        return;
      }

      if (this.burning.has(need)) {
        if (needs.getStatus(need, time) === NeedStatus.Calm) {
          this.burning.delete(need);
        }

        return;
      }

      if (needs.getStatus(need, time) === NeedStatus.Urgent) {
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
