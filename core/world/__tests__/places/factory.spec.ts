import { Geometry } from '@peetland/geometry';
import { describe, expect, it } from 'vitest';

import { Places, PlacesFactory } from '../../src';

describe('PlacesFactory', () => {
  describe('#create', () => {
    it('Возвращает экземпляр Places', () => {
      const factory = new PlacesFactory({ geometry: new Geometry() });

      expect(factory.create({ places: [] })).toBeInstanceOf(Places);
    });
  });
});
