import { describe, expect, it } from 'vitest';

import {
  createPsycheDeps,
  createPsycheState,
  createMockedTrait,
  createMockedTraitFactory,
} from '../dev';
import { Deed, Feeling, MAX_FEELING, MIN_FEELING, Psyche, Trait } from '../src';

describe('Psyche', () => {
  describe('#react', () => {
    it('Передаёт поступок каждой черте', () => {
      const conscientiousness = createMockedTrait();
      const luck = createMockedTrait();
      const psyche = new Psyche(
        createPsycheState(),
        createPsycheDeps({
          [Trait.Conscientiousness]: createMockedTraitFactory(conscientiousness),
          [Trait.Luck]: createMockedTraitFactory(luck),
        })
      );

      psyche.react(Deed.Begging);

      expect(conscientiousness.react).toHaveBeenCalledExactlyOnceWith(Deed.Begging);
      expect(luck.react).toHaveBeenCalledExactlyOnceWith(Deed.Begging);
    });

    it('Меняет чувство на вклад черты', () => {
      const state = createPsycheState({
        feelings: { [Feeling.Shame]: 30 },
      });
      const psyche = new Psyche(
        state,
        createPsycheDeps({
          [Trait.Conscientiousness]: createMockedTraitFactory(
            createMockedTrait({ [Feeling.Shame]: 5 })
          ),
        })
      );

      psyche.react(Deed.Begging);

      expect(psyche.getState().feelings).toStrictEqual({ [Feeling.Shame]: 35 });
    });

    it('Складывает вклады черт в одно чувство', () => {
      const state = createPsycheState({
        feelings: { [Feeling.Shame]: 30 },
      });
      const psyche = new Psyche(
        state,
        createPsycheDeps({
          [Trait.Conscientiousness]: createMockedTraitFactory(
            createMockedTrait({ [Feeling.Shame]: 5 })
          ),
          [Trait.Luck]: createMockedTraitFactory(createMockedTrait({ [Feeling.Shame]: -2 })),
        })
      );

      psyche.react(Deed.Begging);

      expect(psyche.getState().feelings).toStrictEqual({ [Feeling.Shame]: 33 });
    });

    it('Если черта не меняет чувство, оставляет его как есть', () => {
      const state = createPsycheState({
        feelings: { [Feeling.Shame]: 30 },
      });
      const psyche = new Psyche(
        state,
        createPsycheDeps({
          [Trait.Conscientiousness]: createMockedTraitFactory(createMockedTrait({})),
        })
      );

      psyche.react(Deed.Begging);

      expect(psyche.getState().feelings).toStrictEqual({ [Feeling.Shame]: 30 });
    });

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
          [Trait.Luck]: createMockedTraitFactory(createMockedTrait({ [Feeling.Shame]: -50 })),
        })
      );

      psyche.react(Deed.Begging);

      expect(psyche.getState().feelings).toStrictEqual({ [Feeling.Shame]: 80 });
    });

    it('Если вклад не конечное число, выбрасывает RangeError и не меняет чувства', () => {
      const state = createPsycheState({
        feelings: { [Feeling.Shame]: 30 },
      });
      const psyche = new Psyche(
        state,
        createPsycheDeps({
          [Trait.Conscientiousness]: createMockedTraitFactory(
            createMockedTrait({ [Feeling.Shame]: NaN })
          ),
        })
      );

      expect(() => psyche.react(Deed.Begging)).toThrow(RangeError);
      expect(psyche.getState().feelings).toStrictEqual({ [Feeling.Shame]: 30 });
    });
  });
});
