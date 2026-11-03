import { describe, expect, it } from 'vitest';

import { ManualTime } from '../../src';

describe('ManualTime', () => {
  describe('#getState', () => {
    it('Возвращает день, час и минуты текущего времени', () => {
      const time = new ManualTime();
      time.set({
        day: 3,
        hours: 20,
        minutes: 15,
      });

      expect(time.getState()).toStrictEqual({
        day: 3,
        hours: 20,
        minutes: 15,
      });
    });

    it('Возвращает слепок, который не меняется, когда меняется время', () => {
      const time = new ManualTime({
        day: 3,
        hours: 20,
        minutes: 15,
      });
      const state = time.getState();

      time.set({
        day: 4,
        hours: 0,
        minutes: 0,
      });

      expect(state).toStrictEqual({
        day: 3,
        hours: 20,
        minutes: 15,
      });
    });
  });
});
