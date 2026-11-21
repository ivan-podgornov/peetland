import { describe, expect, it } from 'vitest';

import { AlwaysClearLos } from '../src';
import type { ILosProvider } from '../src';

describe('AlwaysClearLos', () => {
  describe('#isLineOfSightClear', () => {
    it('Возвращает true для любых точек', () => {
      const los: ILosProvider = new AlwaysClearLos();

      const isClear = los.isLineOfSightClear(
        {
          x: 0,
          y: 0,
          z: 0,
        },
        {
          x: 10,
          y: 20,
          z: 5,
        }
      );

      expect(isClear).toBe(true);
    });
  });
});
