import { describe, expect, it } from 'vitest';

import { createActor } from './helpers';

describe('VirtualActor', () => {
  describe('#setPosition', () => {
    it('Переносит актора на переданную позицию', () => {
      const actor = createActor({ x: 0, y: 0, z: 0 });

      actor.setPosition({ x: 5, y: 6, z: 7 });

      expect(actor.getPosition()).toStrictEqual({ x: 5, y: 6, z: 7 });
    });

    it('Изменение переданной позиции после вызова не сдвигает актора', () => {
      const actor = createActor();
      const position = { x: 5, y: 6, z: 7 };

      actor.setPosition(position);
      position.x = 100;

      expect(actor.getPosition()).toStrictEqual({ x: 5, y: 6, z: 7 });
    });
  });
});
