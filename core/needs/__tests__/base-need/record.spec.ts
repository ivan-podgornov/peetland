import { describe, expect, it } from 'vitest';

import { DEFAULT_RECORD, TestNeed } from '../../dev';
import { BaseNeed } from '../../src/base-need';

describe('BaseNeed', () => {
  describe('Сеттер record', () => {
    it('Выставляет запись', () => {
      const need = new TestNeed(DEFAULT_RECORD);
      const record = {
        value: 40,
        since: {
          ...DEFAULT_RECORD.since,
          hours: DEFAULT_RECORD.since.hours + 1,
        },
      };

      need.setRecord(record);

      expect(need.getState()).toStrictEqual(record);
    });

    it('Не поднимает значение выше BaseNeed.MAX_NEED', () => {
      const need = new TestNeed(DEFAULT_RECORD);

      need.setRecord({
        ...DEFAULT_RECORD,
        value: BaseNeed.MAX_NEED + 1,
      });

      expect(need.getState().value).toBe(BaseNeed.MAX_NEED);
    });

    it('Не опускает значение ниже BaseNeed.MIN_NEED', () => {
      const need = new TestNeed(DEFAULT_RECORD);

      need.setRecord({
        ...DEFAULT_RECORD,
        value: BaseNeed.MIN_NEED - 1,
      });

      expect(need.getState().value).toBe(BaseNeed.MIN_NEED);
    });
  });
});
