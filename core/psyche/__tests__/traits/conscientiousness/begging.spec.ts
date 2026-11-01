import { describe, expect, it } from 'vitest';

import {
  BEGGING_SHAME,
  Conscientiousness,
  Deed,
  Feeling,
  MAX_CONSCIENTIOUSNESS,
  MIN_CONSCIENTIOUSNESS,
} from '../../../src';

describe('Conscientiousness', () => {
  describe('#react', () => {
    describe('При клянчанье', () => {
      it('Если совестливость средняя, увеличивает стыд на BEGGING_SHAME', () => {
        const conscientiousness = new Conscientiousness(50);

        expect(conscientiousness.react(Deed.Begging)).toStrictEqual({
          [Feeling.Shame]: BEGGING_SHAME,
        });
      });

      it('Если совестливость минимальная, увеличивает стыд вдвое медленнее, чем при средней', () => {
        const conscientiousness = new Conscientiousness(MIN_CONSCIENTIOUSNESS);

        expect(conscientiousness.react(Deed.Begging)).toStrictEqual({
          [Feeling.Shame]: BEGGING_SHAME * 0.5,
        });
      });

      it('Если совестливость максимальная, увеличивает стыд в полтора раза быстрее, чем при средней', () => {
        const conscientiousness = new Conscientiousness(MAX_CONSCIENTIOUSNESS);

        expect(conscientiousness.react(Deed.Begging)).toStrictEqual({
          [Feeling.Shame]: BEGGING_SHAME * 1.5,
        });
      });
    });
  });
});
