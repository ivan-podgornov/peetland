import { Item } from '@peetland/inventory';
import { ManualTime } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { TestNeedModel } from '../../dev';
import { Activity, NeedModel } from '../../src';
import type { EatDetails } from '../../src';

const since = {
  day: 1,
  hours: 10,
  minutes: 0,
};

describe('NeedModel', () => {
  describe('#perform', () => {
    it('Передаёт вкладу занятия его детали', () => {
      const eat = vi.fn(() => 0);
      const details: EatDetails = { food: Item.RomashkaLoaf };

      new TestNeedModel({ [Activity.Eat]: eat }).perform(
        {
          value: 50,
          since,
        },
        Activity.Eat,
        details,
        new ManualTime(since)
      );

      expect(eat).toHaveBeenCalledExactlyOnceWith(details);
    });

    it('Прибавляет вклад занятия к значению на момент, когда занятие закончилось', () => {
      const model = new TestNeedModel({ [Activity.Eat]: () => 30 });

      // За 6 часов, четверть суток, потребность упала с 50 на 25
      const record = model.perform(
        {
          value: 50,
          since,
        },
        Activity.Eat,
        { food: Item.RomashkaLoaf },
        new ManualTime({
          ...since,
          hours: 16,
        })
      );

      expect(record.value).toBeCloseTo(50 - 25 + 30);
    });

    it('Отсчитывает падение от момента, когда занятие закончилось', () => {
      const model = new TestNeedModel({ [Activity.Eat]: () => 30 });
      const end = {
        ...since,
        hours: 16,
      };

      const record = model.perform(
        {
          value: 50,
          since,
        },
        Activity.Eat,
        { food: Item.RomashkaLoaf },
        new ManualTime(end)
      );

      expect(record.since).toStrictEqual(end);
    });

    it('Не поднимает значение выше NeedModel.MAX_NEED', () => {
      const model = new TestNeedModel({ [Activity.Eat]: () => 30 });

      const record = model.perform(
        {
          value: NeedModel.MAX_NEED - 1,
          since,
        },
        Activity.Eat,
        { food: Item.RomashkaLoaf },
        new ManualTime(since)
      );

      expect(record.value).toBe(NeedModel.MAX_NEED);
    });

    it('Не опускает значение ниже NeedModel.MIN_NEED', () => {
      const model = new TestNeedModel({ [Activity.Eat]: () => -30 });

      const record = model.perform(
        {
          value: 10,
          since,
        },
        Activity.Eat,
        { food: Item.RomashkaLoaf },
        new ManualTime(since)
      );

      expect(record.value).toBe(NeedModel.MIN_NEED);
    });

    it('Если занятие не меняет потребность, возвращает ту же запись', () => {
      const record = {
        value: 50,
        since,
      };

      const result = new TestNeedModel().perform(
        record,
        Activity.Eat,
        { food: Item.RomashkaLoaf },
        new ManualTime({
          ...since,
          hours: 16,
        })
      );

      expect(result).toBe(record);
    });
  });
});
