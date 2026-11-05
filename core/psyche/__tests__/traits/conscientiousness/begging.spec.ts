import { describe, expect, it } from 'vitest';

import { Deed, Feeling } from '../../../src';
import { BEGGING_SHAME } from '../../../src/constants';
import { Conscientiousness } from '../../../src/traits';

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
        const conscientiousness = new Conscientiousness(Conscientiousness.MIN);

        expect(conscientiousness.react(Deed.Begging)).toStrictEqual({
          [Feeling.Shame]: BEGGING_SHAME * 0.5,
        });
      });

      it('Если совестливость максимальная, увеличивает стыд в полтора раза быстрее, чем при средней', () => {
        const conscientiousness = new Conscientiousness(Conscientiousness.MAX);

        expect(conscientiousness.react(Deed.Begging)).toStrictEqual({
          [Feeling.Shame]: BEGGING_SHAME * 1.5,
        });
      });
    });
  });
});
