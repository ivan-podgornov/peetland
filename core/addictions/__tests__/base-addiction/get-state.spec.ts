import { describe, expect, it } from 'vitest';

import { DEFAULT_RECORD, TestAddiction } from '../../dev';

describe('BaseAddiction', () => {
  describe('#getState', () => {
    it('Возвращает выставленное значение и момент, когда его выставили', () => {
      const record = {
        ...DEFAULT_RECORD,
        value: 80,
      };

      expect(new TestAddiction(record).getState()).toStrictEqual(record);
    });
  });
});
