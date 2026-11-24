import { Geometry } from '@peetland/geometry';
import { describe, expect, it } from 'vitest';

import { AlwaysClearLos } from '../src';
import type { ILosProvider } from '../src';

describe('AlwaysClearLos', () => {
  describe('#isLineOfSightClear', () => {
    it('Возвращает true для любых точек', () => {
      const los: ILosProvider = new AlwaysClearLos();

      const isClear = los.isLineOfSightClear(
        Geometry.vector3(0, 0, 0),
        Geometry.vector3(10, 20, 5)
      );

      expect(isClear).toBe(true);
    });
  });
});
