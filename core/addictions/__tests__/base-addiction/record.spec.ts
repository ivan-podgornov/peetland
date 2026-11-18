import { describe, expect, it } from 'vitest';

import { DEFAULT_RECORD, TestAddiction } from '../../dev';
import { BaseAddiction } from '../../src/base-addiction';

describe('BaseAddiction', () => {
  describe('Сеттер record', () => {
    it('Выставляет запись', () => {
      const addiction = new TestAddiction(DEFAULT_RECORD);
      const record = {
        craving: 40,
        strength: BaseAddiction.MAX_STRENGTH,
        since: {
          ...DEFAULT_RECORD.since,
          hours: DEFAULT_RECORD.since.hours + 1,
        },
      };

      addiction.setRecord(record);

      expect(addiction.getState()).toStrictEqual(record);
    });

    it('Не поднимает тягу выше BaseAddiction.MAX_CRAVING', () => {
      const addiction = new TestAddiction(DEFAULT_RECORD);

      addiction.setRecord({
        ...DEFAULT_RECORD,
        craving: BaseAddiction.MAX_CRAVING + 1,
      });

      expect(addiction.getState().craving).toBe(BaseAddiction.MAX_CRAVING);
    });

    it('Не опускает тягу ниже BaseAddiction.MIN_CRAVING', () => {
      const addiction = new TestAddiction(DEFAULT_RECORD);

      addiction.setRecord({
        ...DEFAULT_RECORD,
        craving: BaseAddiction.MIN_CRAVING - 1,
      });

      expect(addiction.getState().craving).toBe(BaseAddiction.MIN_CRAVING);
    });
  });
});
