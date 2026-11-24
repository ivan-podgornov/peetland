import { Geometry } from '@peetland/geometry';
import { describe, expect, it } from 'vitest';

import { createActor } from '../dev';

describe('VirtualActor', () => {
  describe('#setPosition', () => {
    it('Переносит актора на переданную позицию', () => {
      const actor = createActor({
        position: Geometry.vector3(0, 0, 0),
      });

      actor.setPosition(Geometry.vector3(5, 6, 7));

      expect(actor.getPosition()).toStrictEqual({
        x: 5,
        y: 6,
        z: 7,
      });
    });

    it('Изменение переданной позиции после вызова не сдвигает актора', () => {
      const actor = createActor();
      const position = Geometry.vector3(5, 6, 7);

      actor.setPosition(position);
      position.x = 100;

      expect(actor.getPosition()).toStrictEqual({
        x: 5,
        y: 6,
        z: 7,
      });
    });
  });
});
