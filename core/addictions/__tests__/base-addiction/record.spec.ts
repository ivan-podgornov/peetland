import { describe, expect, it } from 'vitest';

import { DEFAULT_RECORD, TestAddiction } from '../../dev';
import { BaseAddiction } from '../../src/base-addiction';

describe('BaseAddiction', () => {
  describe('Сеттер record', () => {
    it('Выставляет запись', () => {
      const addiction = new TestAddiction(DEFAULT_RECORD);
      const record = {
        satisfaction: 40,
        strength: BaseAddiction.MAX_STRENGTH,
        since: {
          ...DEFAULT_RECORD.since,
          hours: DEFAULT_RECORD.since.hours + 1,
        },
      };

      addiction.setRecord(record);

      expect(addiction.getState()).toStrictEqual(record);
    });

    it('Не поднимает удовлетворённость выше BaseAddiction.MAX_SATISFACTION', () => {
      const addiction = new TestAddiction(DEFAULT_RECORD);

      addiction.setRecord({
        ...DEFAULT_RECORD,
        satisfaction: BaseAddiction.MAX_SATISFACTION + 1,
      });

      expect(addiction.getState().satisfaction).toBe(BaseAddiction.MAX_SATISFACTION);
    });

    it('Не опускает удовлетворённость ниже BaseAddiction.MIN_SATISFACTION', () => {
      const addiction = new TestAddiction(DEFAULT_RECORD);

      addiction.setRecord({
        ...DEFAULT_RECORD,
        satisfaction: BaseAddiction.MIN_SATISFACTION - 1,
      });

      expect(addiction.getState().satisfaction).toBe(BaseAddiction.MIN_SATISFACTION);
    });
  });
});
