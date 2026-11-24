import { describe, expect, it } from 'vitest';

import { Geometry } from '../src';

describe('Geometry', () => {
  describe('#vector2', () => {
    it('Возвращает точку на плоскости с переданными координатами', () => {
      expect(Geometry.vector2(5, -3)).toStrictEqual({
        x: 5,
        y: -3,
      });
    });
  });
});
