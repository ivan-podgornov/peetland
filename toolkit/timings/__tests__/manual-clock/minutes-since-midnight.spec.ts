import { describe, expect, it } from 'vitest';

import { ManualClock } from '../../src';

describe('ManualClock', () => {
  describe('#minutesSinceMidnight', () => {
    it('Возвращает, сколько минут прошло с полуночи', () => {
      const clock = new ManualClock(20, 15);

      expect(clock.minutesSinceMidnight).toBe(20 * 60 + 15);
    });

    it('За минуту до полуночи возвращает 1439', () => {
      const clock = new ManualClock(23, 59);

      expect(clock.minutesSinceMidnight).toBe(1439);
    });
  });
});
