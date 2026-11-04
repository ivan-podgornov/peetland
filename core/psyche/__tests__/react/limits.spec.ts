import { describe, expect, it } from 'vitest';

import {
  createPsycheDeps,
  createPsycheState,
  createMockedLuck,
  createMockedTrait,
  createMockedTraitFactory,
} from '../../dev';
import { Deed, Feeling, Psyche, Trait } from '../../src';
import { MAX_FEELING, MIN_FEELING } from '../../src/psyche';

describe('Psyche', () => {
  describe('#react', () => {
    it('Если чувство превысило бы MAX_FEELING, устанавливает MAX_FEELING', () => {
      const state = createPsycheState({
        feelings: { [Feeling.Shame]: 90 },
      });
      const psyche = new Psyche(
        state,
        createPsycheDeps({
          [Trait.Conscientiousness]: createMockedTraitFactory(
            createMockedTrait({ [Feeling.Shame]: 20 })
          ),
        })
      );

      psyche.react(Deed.Begging);

      expect(psyche.getState().feelings).toStrictEqual({ [Feeling.Shame]: MAX_FEELING });
    });

    it('Если чувство опустилось бы ниже MIN_FEELING, устанавливает MIN_FEELING', () => {
      const state = createPsycheState({
        feelings: { [Feeling.Shame]: 10 },
      });
      const psyche = new Psyche(
        state,
        createPsycheDeps({
          [Trait.Conscientiousness]: createMockedTraitFactory(
            createMockedTrait({ [Feeling.Shame]: -20 })
          ),
        })
      );

      psyche.react(Deed.BottleFound);

      expect(psyche.getState().feelings).toStrictEqual({ [Feeling.Shame]: MIN_FEELING });
    });

    it('Применяет пределы к сумме вкладов, а не к каждому вкладу', () => {
      const state = createPsycheState({
        feelings: { [Feeling.Shame]: 50 },
      });
      const psyche = new Psyche(
        state,
        createPsycheDeps({
          [Trait.Conscientiousness]: createMockedTraitFactory(
            createMockedTrait({ [Feeling.Shame]: 80 })
          ),
          [Trait.Luck]: createMockedTraitFactory(createMockedLuck({ [Feeling.Shame]: -50 })),
        })
      );

      psyche.react(Deed.Begging);

      expect(psyche.getState().feelings).toStrictEqual({ [Feeling.Shame]: 80 });
    });
  });
});
