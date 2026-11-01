import { describe, expect, it } from 'vitest';

import { PlaceType } from '../../src';
import { createPlace } from '../tasks/helpers';

import { createPlaces } from './helpers';

describe('Places', () => {
  describe('#ofType', () => {
    it('Возвращает места переданного типа', () => {
      const shop = createPlace({ id: 'shop', type: PlaceType.Shop });
      const bin = createPlace({ id: 'bin', type: PlaceType.TrashBin });

      expect(createPlaces([shop, bin]).ofType(PlaceType.Shop)).toStrictEqual([shop]);
    });

    it('Если мест переданного типа нет, возвращает пустой список', () => {
      const places = createPlaces([createPlace({ type: PlaceType.TrashBin })]);

      expect(places.ofType(PlaceType.Shop)).toStrictEqual([]);
    });
  });
});
