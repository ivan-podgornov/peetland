import { describe, expect, it } from 'vitest';

import { DEFAULT_RECORD, TestAddiction } from '../../dev';

describe('BaseAddiction', () => {
  describe('#getState', () => {
    it('Возвращает выставленные тягу, силу и момент, когда тягу выставили', () => {
      const record = {
        ...DEFAULT_RECORD,
        craving: 80,
      };

      expect(new TestAddiction(record).getState()).toStrictEqual(record);
    });
  });
});
