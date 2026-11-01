import { describe, expect, it } from 'vitest';

import { PlaceType } from '../../src';
import { createPlace } from '../tasks/helpers';

import { createPlaces } from './helpers';

const ORIGIN = { x: 0, y: 0, z: 0 };

describe('Places', () => {
  describe('#isNear', () => {
    it('Если место переданного типа ближе радиуса, возвращает true', () => {
      const places = createPlaces([createPlace({ position: { x: 2, y: 0, z: 0 } })]);

      expect(places.isNear(ORIGIN, PlaceType.Shop, 3)).toBe(true);
    });

    it('Если место переданного типа ровно на радиусе, возвращает true', () => {
      const places = createPlaces([createPlace({ position: { x: 3, y: 0, z: 0 } })]);

      expect(places.isNear(ORIGIN, PlaceType.Shop, 3)).toBe(true);
    });

    it('Если место переданного типа дальше радиуса, возвращает false', () => {
      const places = createPlaces([createPlace({ position: { x: 4, y: 0, z: 0 } })]);

      expect(places.isNear(ORIGIN, PlaceType.Shop, 3)).toBe(false);
    });

    it('Если рядом только место другого типа, возвращает false', () => {
      const places = createPlaces([createPlace({ type: PlaceType.TrashBin, position: ORIGIN })]);

      expect(places.isNear(ORIGIN, PlaceType.Shop, 3)).toBe(false);
    });
  });
});
