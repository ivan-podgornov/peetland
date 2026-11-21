import { describe, expect, it } from 'vitest';

import { VirtualGame } from '../../src';

describe('VirtualGame', () => {
  describe('Акторы игры', () => {
    it('Актор, созданный фабрикой игры, попадает в общий реестр игры', () => {
      const game = new VirtualGame();

      const actor = game.actorFactory.create({
        modelId: 230,
        position: {
          x: 0,
          y: 0,
          z: 0,
        },
        angle: 0,
      });

      expect(game.actorRegistry.getAll()).toStrictEqual([actor]);
    });

    it('Деспавн актора убирает его из общего реестра игры', () => {
      const game = new VirtualGame();
      const actor = game.actorFactory.create({
        modelId: 230,
        position: {
          x: 0,
          y: 0,
          z: 0,
        },
        angle: 0,
      });

      actor.despawn();

      expect(game.actorRegistry.getAll()).toStrictEqual([]);
    });
  });
});
