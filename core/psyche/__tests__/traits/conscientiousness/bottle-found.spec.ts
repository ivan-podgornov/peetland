import { describe, expect, it } from 'vitest';

import {
  BOTTLE_FOUND_SHAME_RELIEF,
  Conscientiousness,
  Deed,
  Feeling,
  MAX_CONSCIENTIOUSNESS,
  MIN_CONSCIENTIOUSNESS,
} from '../../../src';

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
        const conscientiousness = new Conscientiousness(MIN_CONSCIENTIOUSNESS);

        expect(conscientiousness.react(Deed.BottleFound)).toStrictEqual({
          [Feeling.Shame]: -BOTTLE_FOUND_SHAME_RELIEF * 1.5,
        });
      });

      it('Если совестливость максимальная, уменьшает стыд вдвое медленнее, чем при средней', () => {
        const conscientiousness = new Conscientiousness(MAX_CONSCIENTIOUSNESS);

        expect(conscientiousness.react(Deed.BottleFound)).toStrictEqual({
          [Feeling.Shame]: -BOTTLE_FOUND_SHAME_RELIEF * 0.5,
        });
      });
    });
  });
});
