import { describe, expect, it } from 'vitest';

import { TestNeed } from '../../dev';

describe('BaseNeed', () => {
  describe('#getState', () => {
    it('Возвращает выставленное значение и момент, когда его выставили', () => {
      const record = {
        value: 80,
        since: {
          day: 1,
          hours: 10,
          minutes: 0,
        },
      };

      expect(new TestNeed(record).getState()).toStrictEqual(record);
    });
  });
});
