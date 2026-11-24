import { describe, expect, it } from 'vitest';

import { Geometry } from '../src';

describe('Geometry', () => {
  describe('#vector3', () => {
    it('Возвращает точку в пространстве с переданными координатами', () => {
      expect(Geometry.vector3(1, -2, 3)).toStrictEqual({
        x: 1,
        y: -2,
        z: 3,
      });
    });
  });
});
