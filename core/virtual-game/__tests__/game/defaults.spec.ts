import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { VirtualGame } from '../../src';

describe('VirtualGame', () => {
  describe('Без переданных deps', () => {
    it('Время стоит в полночь первого дня', () => {
      const game = new VirtualGame();

      expect(game.time.getState()).toStrictEqual({
        day: 1,
        hours: 0,
        minutes: 0,
      });
    });
  });

  describe('С переданным временем', () => {
    it('Игра показывает переданное время', () => {
      const time = new ManualTime({
        day: 2,
        hours: 13,
        minutes: 37,
      });
      const game = new VirtualGame({ time });

      expect(game.time.getState()).toStrictEqual({
        day: 2,
        hours: 13,
        minutes: 37,
      });
    });
  });
});
