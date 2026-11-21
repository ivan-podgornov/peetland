import { describe, expect, it, vi } from 'vitest';

import { VirtualGame } from '../../src';

describe('VirtualGame', () => {
  describe('#terminate', () => {
    it('Прерывает сигнал игры', () => {
      const game = new VirtualGame();

      game.terminate();

      expect(game.signal.aborted).toBe(true);
    });

    it('После завершения игры тиков больше нет', () => {
      const game = new VirtualGame();
      const onTick = vi.fn();
      game.ticks.subscribe(onTick);

      game.terminate();
      game.advanceTime(1000);

      expect(onTick).not.toHaveBeenCalled();
    });
  });
});
