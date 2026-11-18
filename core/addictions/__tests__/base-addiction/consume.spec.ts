import { Item } from '@peetland/inventory';
import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { DEFAULT_RECORD, TestAddiction } from '../../dev';
import { ConsumptionType } from '../../src';
import { BaseAddiction } from '../../src/base-addiction';

const DRINK = {
  type: ConsumptionType.Drink,
  details: { booze: Item.Booze },
} as const;

describe('BaseAddiction', () => {
  describe('#consume', () => {
    it('Снимает то, что вернул getRelief, с тяги на момент, когда NPC закончил употреблять', () => {
      const addiction = new TestAddiction({
        ...DEFAULT_RECORD,
        craving: 50,
      });
      // За 6 часов из суток тяга выросла на 25
      const time = new ManualTime({
        ...DEFAULT_RECORD.since,
        hours: DEFAULT_RECORD.since.hours + 6,
      });

      addiction.consume(DRINK, time);

      expect(addiction.get(time)).toBeCloseTo(50 + 25 - TestAddiction.RELIEF);
    });

    it('Отсчитывает рост тяги от момента, когда NPC закончил употреблять', () => {
      const addiction = new TestAddiction(DEFAULT_RECORD);
      const end = {
        ...DEFAULT_RECORD.since,
        hours: DEFAULT_RECORD.since.hours + 6,
      };

      addiction.consume(DRINK, new ManualTime(end));

      expect(addiction.getState().since).toStrictEqual(end);
    });

    it('Не опускает тягу ниже BaseAddiction.MIN_CRAVING', () => {
      const addiction = new TestAddiction(DEFAULT_RECORD);
      const time = new ManualTime(DEFAULT_RECORD.since);

      addiction.consume(DRINK, time);

      expect(addiction.get(time)).toBe(BaseAddiction.MIN_CRAVING);
    });

    it('Не меняет силу зависимости', () => {
      const addiction = new TestAddiction({
        ...DEFAULT_RECORD,
        strength: 70,
      });

      addiction.consume(DRINK, new ManualTime(DEFAULT_RECORD.since));

      expect(addiction.getState().strength).toBe(70);
    });
  });
});
