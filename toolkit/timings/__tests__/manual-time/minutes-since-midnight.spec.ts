import { describe, expect, it } from 'vitest';

import { ManualTime } from '../../src';

describe('ManualTime', () => {
  describe('#minutesSinceMidnight', () => {
    it('Возвращает, сколько минут прошло с полуночи', () => {
      const time = new ManualTime({
        hours: 20,
        minutes: 15,
      });

      expect(time.minutesSinceMidnight).toBe(20 * 60 + 15);
    });

    it('За минуту до полуночи возвращает 1439', () => {
      const time = new ManualTime({
        hours: 23,
        minutes: 59,
      });

      expect(time.minutesSinceMidnight).toBe(1439);
    });
  });
});
