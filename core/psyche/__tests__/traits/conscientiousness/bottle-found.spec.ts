import { describe, expect, it } from 'vitest';

import { Deed, Feeling } from '../../../src';
import { BOTTLE_FOUND_SHAME_RELIEF } from '../../../src/constants';
import { Conscientiousness } from '../../../src/traits';

describe('Conscientiousness', () => {
  describe('#react', () => {
    describe('При находке бутылки', () => {
      it('Если совестливость средняя, уменьшает стыд на BOTTLE_FOUND_SHAME_RELIEF', () => {
        const conscientiousness = new Conscientiousness(50);

        expect(conscientiousness.react(Deed.BottleFound)).toStrictEqual({
          [Feeling.Shame]: -BOTTLE_FOUND_SHAME_RELIEF,
        });
      });

      it('Если совестливость минимальная, уменьшает стыд в полтора раза быстрее, чем при средней', () => {
        const conscientiousness = new Conscientiousness(Conscientiousness.MIN);

        expect(conscientiousness.react(Deed.BottleFound)).toStrictEqual({
          [Feeling.Shame]: -BOTTLE_FOUND_SHAME_RELIEF * 1.5,
        });
      });

      it('Если совестливость максимальная, уменьшает стыд вдвое медленнее, чем при средней', () => {
        const conscientiousness = new Conscientiousness(Conscientiousness.MAX);

        expect(conscientiousness.react(Deed.BottleFound)).toStrictEqual({
          [Feeling.Shame]: -BOTTLE_FOUND_SHAME_RELIEF * 0.5,
        });
      });
    });
  });
});
