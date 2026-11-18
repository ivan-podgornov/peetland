import { Item } from '@peetland/inventory';
import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { createMockedNeedsValidator, DEFAULT_RECORD, TestAddiction } from '../../dev';
import { ActivityType } from '../../src';
import type { AddictionRecord } from '../../src';
import { BaseAddiction } from '../../src/base-addiction';

describe('BaseAddiction', () => {
  describe('Сила', () => {
    it('Проверяет силу валидатором в пределах от MIN_STRENGTH до MAX_STRENGTH', () => {
      const validator = createMockedNeedsValidator();

      new TestAddiction(
        {
          ...DEFAULT_RECORD,
          strength: 70,
        },
        { validator }
      );

      expect(validator.validateStrength).toHaveBeenCalledExactlyOnceWith(
        70,
        BaseAddiction.MIN_STRENGTH,
        BaseAddiction.MAX_STRENGTH
      );
    });

    it('getState возвращает значение, момент и силу зависимости', () => {
      const record: AddictionRecord = {
        ...DEFAULT_RECORD,
        value: 40,
        strength: 70,
      };

      expect(new TestAddiction(record).getState()).toStrictEqual(record);
    });

    it('Занятие не меняет силу зависимости', () => {
      const addiction = new TestAddiction({
        ...DEFAULT_RECORD,
        strength: 70,
      });

      addiction.perform(
        {
          type: ActivityType.Drink,
          details: { booze: Item.Booze },
        },
        new ManualTime(DEFAULT_RECORD.since)
      );

      expect(addiction.getState().strength).toBe(70);
    });
  });
});
