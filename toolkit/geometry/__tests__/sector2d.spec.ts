import { describe, expect, it } from 'vitest';

import { Geometry } from '../src';

describe('Geometry', () => {
  describe('#sector2d', () => {
    it('Возвращает сектор с переданными вершиной, направлением и угловым размером', () => {
      const origin = Geometry.vector2(10, 20);

      expect(Geometry.sector2d(origin, 90, 100)).toStrictEqual({
        origin: {
          x: 10,
          y: 20,
        },
        angle: 90,
        fovDeg: 100,
      });
    });
  });
});
