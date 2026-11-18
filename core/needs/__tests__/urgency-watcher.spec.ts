import { ManualTime } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { Need, NeedCategory, NeedStatus, UrgencyWatcher } from '../src';
import type { IReadonlyNeeds } from '../src';

/** Создаёт потребности с указанными статусами */
function createNeeds(satiety: NeedStatus, booze: NeedStatus = NeedStatus.Calm): IReadonlyNeeds {
  return {
    get: vi.fn(),
    getAll: vi.fn(),
    getState: vi.fn(),
    clone: vi.fn(),
    getCategory: vi.fn((need: Need) =>
      need === Need.Satiety ? NeedCategory.Vital : NeedCategory.Addiction
    ),
    getStatus: vi.fn((need: Need) => (need === Need.Satiety ? satiety : booze)),
  } as unknown as IReadonlyNeeds;
}

describe('UrgencyWatcher', () => {
  describe('#check', () => {
    it('Если потребность стала срочной, возвращает true', () => {
      const watcher = new UrgencyWatcher();

      expect(watcher.check(createNeeds(NeedStatus.Urgent), new ManualTime())).toBe(true);
    });

    it('Если срочной стала зависимость, возвращает false: тяга не прерывает план', () => {
      const watcher = new UrgencyWatcher();

      expect(watcher.check(createNeeds(NeedStatus.Calm, NeedStatus.Urgent), new ManualTime())).toBe(
        false
      );
    });

    it('Если срочных потребностей нет, возвращает false', () => {
      const watcher = new UrgencyWatcher();

      expect(watcher.check(createNeeds(NeedStatus.Moderate), new ManualTime())).toBe(false);
    });

    it('Если потребность всё ещё срочная, на следующей проверке возвращает false', () => {
      const watcher = new UrgencyWatcher();
      const time = new ManualTime();
      watcher.check(createNeeds(NeedStatus.Urgent), time);

      expect(watcher.check(createNeeds(NeedStatus.Urgent), time)).toBe(false);
    });

    it('Если срочная потребность поднялась выше порога срочности, но не стала спокойной, а потом снова упала, возвращает false', () => {
      const watcher = new UrgencyWatcher();
      const time = new ManualTime();
      watcher.check(createNeeds(NeedStatus.Urgent), time);
      watcher.check(createNeeds(NeedStatus.Moderate), time);

      expect(watcher.check(createNeeds(NeedStatus.Urgent), time)).toBe(false);
    });

    it('Если срочная потребность стала спокойной, а потом снова срочной, возвращает true', () => {
      const watcher = new UrgencyWatcher();
      const time = new ManualTime();
      watcher.check(createNeeds(NeedStatus.Urgent), time);
      watcher.check(createNeeds(NeedStatus.Calm), time);

      expect(watcher.check(createNeeds(NeedStatus.Urgent), time)).toBe(true);
    });

    it('Проверяет потребности на момент переданного времени', () => {
      const watcher = new UrgencyWatcher();
      const needs = createNeeds(NeedStatus.Moderate);
      const time = new ManualTime();

      watcher.check(needs, time);

      expect(needs.getStatus).toHaveBeenCalledWith(expect.anything(), time);
    });
  });
});
