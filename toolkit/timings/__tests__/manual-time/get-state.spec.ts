import { describe, expect, it } from 'vitest';

import { ManualTime } from '../../src';

describe('ManualTime', () => {
  describe('#getState', () => {
    it('Возвращает час и минуты текущего времени', () => {
      const time = new ManualTime();
      time.set(20, 15);

      expect(time.getState()).toStrictEqual({
        hours: 20,
        minutes: 15,
      });
    });

    it('Возвращает слепок, который не меняется, когда меняется время', () => {
      const time = new ManualTime({
        hours: 20,
        minutes: 15,
      });
      const state = time.getState();

      time.set(21, 0);

      expect(state).toStrictEqual({
        hours: 20,
        minutes: 15,
      });
    });
  });
});
