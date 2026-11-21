import { ActorRegistry } from '@peetland/game';
import { describe, expect, it } from 'vitest';

import { VirtualGame } from '../../src';

describe('VirtualGame', () => {
  describe('Фабрика акторов', () => {
    it('Создаётся с реестром акторов из зависимостей игры', () => {
      const actorRegistry = new ActorRegistry();
      const game = new VirtualGame({ actorRegistry });

      const actor = game.actorFactory.create({
        modelId: 230,
        position: {
          x: 0,
          y: 0,
          z: 0,
        },
        angle: 0,
      });

      expect(actorRegistry.getAll()).toStrictEqual([actor]);
    });
  });
});
