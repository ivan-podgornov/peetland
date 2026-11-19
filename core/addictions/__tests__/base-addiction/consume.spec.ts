import { Item } from '@peetland/inventory';
import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { DEFAULT_RECORD, TestAddiction } from '../../dev';
import { ConsumptionType } from '../../src';

const DRINK = {
  type: ConsumptionType.Drink,
  details: { booze: Item.Booze },
} as const;

describe('BaseAddiction', () => {
  describe('#consume', () => {
    it('Прибавляет вклад употребления из getGain к удовлетворённости на момент, когда NPC закончил употреблять', () => {
      const addiction = new TestAddiction({
        ...DEFAULT_RECORD,
        satisfaction: 50,
      });
      // За 6 часов из суток удовлетворённость падает на 25
      const time = new ManualTime({
        ...DEFAULT_RECORD.since,
        hours: DEFAULT_RECORD.since.hours + 6,
      });

      addiction.consume(DRINK, time);

      expect(addiction.get(time)).toBeCloseTo(50 - 25 + TestAddiction.GAIN);
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
