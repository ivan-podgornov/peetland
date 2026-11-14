import { ManualTime } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { UrgencyWatcher } from '../src';
import type { IReadonlyNeeds } from '../src';

/** Создаёт потребности, у которых сытость срочная, спокойная или между порогами */
function createNeeds(satiety: 'urgent' | 'between' | 'calm'): IReadonlyNeeds {
  return {
    get: vi.fn(),
    getAll: vi.fn(),
    getState: vi.fn(),
    clone: vi.fn(),
    isUrgent: vi.fn(() => satiety === 'urgent'),
    isCalm: vi.fn(() => satiety === 'calm'),
  } as unknown as IReadonlyNeeds;
}

const time = new ManualTime();

describe('UrgencyWatcher', () => {
  describe('#check', () => {
    it('Если потребность стала срочной, возвращает true', () => {
      const watcher = new UrgencyWatcher();

      expect(watcher.check(createNeeds('urgent'), time)).toBe(true);
    });

    it('Если срочных потребностей нет, возвращает false', () => {
      const watcher = new UrgencyWatcher();

      expect(watcher.check(createNeeds('between'), time)).toBe(false);
    });

    it('Если потребность всё ещё срочная, на следующей проверке возвращает false', () => {
      const watcher = new UrgencyWatcher();
      watcher.check(createNeeds('urgent'), time);

      expect(watcher.check(createNeeds('urgent'), time)).toBe(false);
    });

    it('Если срочная потребность поднялась выше порога срочности, но не стала спокойной, а потом снова упала, возвращает false', () => {
      const watcher = new UrgencyWatcher();
      watcher.check(createNeeds('urgent'), time);
      watcher.check(createNeeds('between'), time);

      expect(watcher.check(createNeeds('urgent'), time)).toBe(false);
    });

    it('Если срочная потребность стала спокойной, а потом снова срочной, возвращает true', () => {
      const watcher = new UrgencyWatcher();
      watcher.check(createNeeds('urgent'), time);
      watcher.check(createNeeds('calm'), time);

      expect(watcher.check(createNeeds('urgent'), time)).toBe(true);
    });

    it('Проверяет потребности на момент переданного времени', () => {
      const watcher = new UrgencyWatcher();
      const needs = createNeeds('between');

      watcher.check(needs, time);

      expect(needs.isUrgent).toHaveBeenCalledWith(expect.anything(), time);
    });
  });
});
