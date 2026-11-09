import { describe, expect, it } from 'vitest';

import { ManualTime } from '../../../src';

describe('ManualTime', () => {
  describe('#set', () => {
    it('Если слепок не момент времени, выбрасывает RangeError', () => {
      const time = new ManualTime();

      expect(() =>
        time.set({
          day: 1,
          hours: 24,
          minutes: 0,
        })
      ).toThrow(RangeError);
    });

    it('Если слепок не момент времени, не меняет время', () => {
      const time = new ManualTime({
        day: 3,
        hours: 20,
        minutes: 15,
      });

      expect(() =>
        time.set({
          day: 4,
          hours: 0,
          minutes: 60,
        })
      ).toThrow(RangeError);
      expect(time.getState()).toStrictEqual({
        day: 3,
        hours: 20,
        minutes: 15,
      });
    });
  });
});
