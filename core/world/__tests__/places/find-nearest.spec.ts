import { describe, expect, it } from 'vitest';

import { PlaceType } from '../../src';
import { createPlace } from '../tasks/helpers';

import { createPlaces } from './helpers';

const ORIGIN = { x: 0, y: 0, z: 0 };

describe('Places', () => {
  describe('#findNearest', () => {
    it('Возвращает место переданного типа, ближайшее к позиции', () => {
      const near = createPlace({ id: 'near', position: { x: 5, y: 0, z: 0 } });
      const far = createPlace({ id: 'far', position: { x: -10, y: 0, z: 0 } });

      expect(createPlaces([far, near]).findNearest(ORIGIN, PlaceType.Shop)).toBe(near);
    });

    it('Не возвращает место другого типа, даже если оно ближе', () => {
      const bin = createPlace({ id: 'bin', type: PlaceType.TrashBin, position: ORIGIN });
      const shop = createPlace({ id: 'shop', position: { x: 10, y: 0, z: 0 } });

      expect(createPlaces([bin, shop]).findNearest(ORIGIN, PlaceType.Shop)).toBe(shop);
    });

    it('Если ближайших мест несколько, возвращает первое из них', () => {
      const first = createPlace({ id: 'first', position: { x: 5, y: 0, z: 0 } });
      const second = createPlace({ id: 'second', position: { x: -5, y: 0, z: 0 } });

      expect(createPlaces([first, second]).findNearest(ORIGIN, PlaceType.Shop)).toBe(first);
    });

    it('Если мест переданного типа нет, возвращает undefined', () => {
      const places = createPlaces([createPlace({ type: PlaceType.TrashBin })]);

      expect(places.findNearest(ORIGIN, PlaceType.Shop)).toBeUndefined();
    });
  });
});
