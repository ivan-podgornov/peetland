import { Item } from '@peetland/inventory';
import type { Food } from '@peetland/inventory';
import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { DEFAULT_RECORD, DEFAULT_NEED_DEPS } from '../dev';
import { ActivityType, NeedCategory } from '../src';
import { Satiety } from '../src/satiety';

describe('Satiety', () => {
  it('Сытость — жизненная потребность', () => {
    const satiety = new Satiety(DEFAULT_RECORD, DEFAULT_NEED_DEPS);

    expect(satiety.category).toBe(NeedCategory.Vital);
  });

  it('Падает от максимума до нуля за игровые сутки', () => {
    const record = {
      ...DEFAULT_RECORD,
      value: 100,
    };
    const satiety = new Satiety(record, DEFAULT_NEED_DEPS);

    const value = satiety.get(
      new ManualTime({
        ...record.since,
        day: record.since.day + 1,
      })
    );

    expect(value).toBe(0);
  });

  describe('#getGain', () => {
    it.each<{ food: Food; gain: number }>([
      {
        food: Item.RomashkaLoaf,
        gain: 60,
      },
      {
        food: Item.SmilePizza,
        gain: 100,
      },
    ])('Если съели $food, возвращает $gain', ({ food, gain }) => {
      const satiety = new Satiety(DEFAULT_RECORD, DEFAULT_NEED_DEPS);

      expect(
        satiety.getGain({
          type: ActivityType.Eat,
          details: { food },
        })
      ).toBe(gain);
    });

    it('Питьё не влияет на сытость: возвращает 0', () => {
      const satiety = new Satiety(DEFAULT_RECORD, DEFAULT_NEED_DEPS);

      expect(
        satiety.getGain({
          type: ActivityType.Drink,
          details: { booze: Item.Booze },
        })
      ).toBe(0);
    });

    it('Не учитывает пределы: сытая сытость всё равно возвращает весь вклад еды', () => {
      const satiety = new Satiety(
        {
          ...DEFAULT_RECORD,
          value: 100,
        },
        DEFAULT_NEED_DEPS
      );

      expect(
        satiety.getGain({
          type: ActivityType.Eat,
          details: { food: Item.SmilePizza },
        })
      ).toBe(100);
    });
  });

  describe('#perform', () => {
    it.each<{ food: Food; satiety: number }>([
      {
        food: Item.RomashkaLoaf,
        satiety: 60,
      },
      {
        food: Item.SmilePizza,
        satiety: 100,
      },
    ])('Если съели $food, восполняет $satiety сытости', ({ food, satiety }) => {
      const record = {
        ...DEFAULT_RECORD,
        value: 0,
      };
      const need = new Satiety(record, DEFAULT_NEED_DEPS);
      const time = new ManualTime(record.since);

      need.perform(
        {
          type: ActivityType.Eat,
          details: { food },
        },
        time
      );

      expect(need.get(time)).toBe(satiety);
    });

    it('Прибавляет еду к сытости на момент, когда NPC поел', () => {
      const record = {
        ...DEFAULT_RECORD,
        value: 50,
      };
      const need = new Satiety(record, DEFAULT_NEED_DEPS);
      const time = new ManualTime({
        ...record.since,
        hours: record.since.hours + 6,
      });

      need.perform(
        {
          type: ActivityType.Eat,
          details: { food: Item.RomashkaLoaf },
        },
        time
      );

      // За четверть суток сытость упала с 50 на 25, а батон прибавил 60
      expect(need.get(time)).toBeCloseTo(50 - 25 + 60);
    });

    it('Отсчитывает падение от момента, когда NPC поел', () => {
      const need = new Satiety(
        {
          ...DEFAULT_RECORD,
          value: 50,
        },
        DEFAULT_NEED_DEPS
      );
      const end = {
        ...DEFAULT_RECORD.since,
        hours: DEFAULT_RECORD.since.hours + 6,
      };

      need.perform(
        {
          type: ActivityType.Eat,
          details: { food: Item.RomashkaLoaf },
        },
        new ManualTime(end)
      );

      expect(need.getState().since).toStrictEqual(end);
    });

    it('Не поднимает сытость выше максимума', () => {
      const need = new Satiety(
        {
          ...DEFAULT_RECORD,
          value: 90,
        },
        DEFAULT_NEED_DEPS
      );
      const time = new ManualTime(DEFAULT_RECORD.since);

      need.perform(
        {
          type: ActivityType.Eat,
          details: { food: Item.SmilePizza },
        },
        time
      );

      expect(need.get(time)).toBe(100);
    });
  });
});
