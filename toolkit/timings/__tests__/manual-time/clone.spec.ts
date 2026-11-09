import { describe, expect, it } from 'vitest';

import { ManualTime } from '../../src';

describe('ManualTime', () => {
  describe('#clone', () => {
    it('Возвращает время с тем же днём, часом и минутами', () => {
      const time = new ManualTime({
        day: 3,
        hours: 20,
        minutes: 15,
      });

      expect(time.clone().getState()).toStrictEqual({
        day: 3,
        hours: 20,
        minutes: 15,
      });
    });

    it('Возвращает новый экземпляр ManualTime', () => {
      const time = new ManualTime();

      expect(time.clone()).not.toBe(time);
    });

    it('Изменение копии не меняет исходное время', () => {
      const time = new ManualTime({
        day: 3,
        hours: 20,
        minutes: 15,
      });
      const copy = time.clone();

      copy.set({
        day: 4,
        hours: 1,
        minutes: 0,
      });

      expect(time.getState()).toStrictEqual({
        day: 3,
        hours: 20,
        minutes: 15,
      });
    });

    it('Изменение исходного времени не меняет копию', () => {
      const time = new ManualTime({
        day: 3,
        hours: 20,
        minutes: 15,
      });
      const copy = time.clone();

      time.set({
        day: 4,
        hours: 1,
        minutes: 0,
      });

      expect(copy.getState()).toStrictEqual({
        day: 3,
        hours: 20,
        minutes: 15,
      });
    });
  });
});
