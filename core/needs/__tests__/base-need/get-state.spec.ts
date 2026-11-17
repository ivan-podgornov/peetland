import { describe, expect, it } from 'vitest';

import { DEFAULT_RECORD, TestNeed } from '../../dev';

describe('BaseNeed', () => {
  describe('#getState', () => {
    it('Возвращает выставленное значение и момент, когда его выставили', () => {
      const record = {
        ...DEFAULT_RECORD,
        value: 80,
      };

      expect(new TestNeed(record).getState()).toStrictEqual(record);
    });
  });
});
