import { describe, expect, it } from 'vitest';

import { DEFAULT_RECORD, TestAddiction } from '../../dev';
import { BaseAddiction } from '../../src/base-addiction';

describe('BaseAddiction', () => {
  describe('Сеттер record', () => {
    it('Выставляет запись', () => {
      const addiction = new TestAddiction(DEFAULT_RECORD);
      const record = {
        value: 40,
        strength: BaseAddiction.MAX_STRENGTH,
        since: {
          ...DEFAULT_RECORD.since,
          hours: DEFAULT_RECORD.since.hours + 1,
        },
      };

      addiction.setRecord(record);

      expect(addiction.getState()).toStrictEqual(record);
    });

    it('Не поднимает значение выше BaseAddiction.MAX_VALUE', () => {
      const addiction = new TestAddiction(DEFAULT_RECORD);

      addiction.setRecord({
        ...DEFAULT_RECORD,
        value: BaseAddiction.MAX_VALUE + 1,
      });

      expect(addiction.getState().value).toBe(BaseAddiction.MAX_VALUE);
    });

    it('Не опускает значение ниже BaseAddiction.MIN_VALUE', () => {
      const addiction = new TestAddiction(DEFAULT_RECORD);

      addiction.setRecord({
        ...DEFAULT_RECORD,
        value: BaseAddiction.MIN_VALUE - 1,
      });

      expect(addiction.getState().value).toBe(BaseAddiction.MIN_VALUE);
    });
  });
});
