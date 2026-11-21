import { describe, expect, it, vi } from 'vitest';

import { VirtualGame } from '../../src';

describe('VirtualGame', () => {
  describe('#tick', () => {
    it('Производит один тик мира', () => {
      const game = new VirtualGame();
      const onTick = vi.fn();
      game.ticks.subscribe(onTick);

      game.tick();

      expect(onTick).toHaveBeenCalledOnce();
    });
  });
});
