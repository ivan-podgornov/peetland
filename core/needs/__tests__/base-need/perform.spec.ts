import { Item } from '@peetland/inventory';
import { ManualTime } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { TestNeed } from '../../dev';
import { Activity, BaseNeed } from '../../src';
import type { EatDetails } from '../../src';

const since = {
  day: 1,
  hours: 10,
  minutes: 0,
};

const details: EatDetails = { food: Item.RomashkaLoaf };

describe('BaseNeed', () => {
  describe('#perform', () => {
    it('Передаёт вкладу занятия его детали', () => {
      const eat = vi.fn(() => 0);
      const need = new TestNeed(
        {
          value: 50,
          since,
        },
        { [Activity.Eat]: eat }
      );

      need.perform(Activity.Eat, details, new ManualTime(since));

      expect(eat).toHaveBeenCalledExactlyOnceWith(details);
    });

    it('Прибавляет вклад занятия к значению на момент, когда занятие закончилось', () => {
      const need = new TestNeed(
        {
          value: 50,
          since,
        },
        { [Activity.Eat]: () => 30 }
      );
      const time = new ManualTime({
        ...since,
        hours: 16,
      });

      need.perform(Activity.Eat, details, time);

      // За 6 часов, четверть суток, потребность упала с 50 на 25
      expect(need.get(time)).toBeCloseTo(50 - 25 + 30);
    });

    it('Отсчитывает падение от момента, когда занятие закончилось', () => {
      const need = new TestNeed(
        {
          value: 50,
          since,
        },
        { [Activity.Eat]: () => 30 }
      );
      const end = {
        ...since,
        hours: 16,
      };

      need.perform(Activity.Eat, details, new ManualTime(end));

      expect(need.getState().since).toStrictEqual(end);
    });

    it('Не поднимает значение выше BaseNeed.MAX_NEED', () => {
      const need = new TestNeed(
        {
          value: BaseNeed.MAX_NEED - 1,
          since,
        },
        { [Activity.Eat]: () => 30 }
      );
      const time = new ManualTime(since);

      need.perform(Activity.Eat, details, time);

      expect(need.get(time)).toBe(BaseNeed.MAX_NEED);
    });

    it('Не опускает значение ниже BaseNeed.MIN_NEED', () => {
      const need = new TestNeed(
        {
          value: 10,
          since,
        },
        { [Activity.Eat]: () => -30 }
      );
      const time = new ManualTime(since);

      need.perform(Activity.Eat, details, time);

      expect(need.get(time)).toBe(BaseNeed.MIN_NEED);
    });

    it('Если занятие не меняет потребность, не меняет запись', () => {
      const record = {
        value: 50,
        since,
      };
      const need = new TestNeed(record);

      need.perform(
        Activity.Eat,
        details,
        new ManualTime({
          ...since,
          hours: 16,
        })
      );

      expect(need.getState()).toBe(record);
    });
  });
});
