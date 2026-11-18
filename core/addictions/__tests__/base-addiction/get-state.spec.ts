import { describe, expect, it } from 'vitest';

import { DEFAULT_RECORD, TestAddiction } from '../../dev';

describe('BaseAddiction', () => {
  describe('#getState', () => {
    it('Возвращает выставленные удовлетворённость, силу и момент, когда удовлетворённость выставили', () => {
      const record = {
        ...DEFAULT_RECORD,
        satisfaction: 80,
      };

      expect(new TestAddiction(record).getState()).toStrictEqual(record);
    });
  });
});
