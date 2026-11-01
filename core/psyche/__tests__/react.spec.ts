import { describe, expect, it } from 'vitest';

import { Deed, Feeling, MAX_FEELING, MIN_FEELING, Psyche, Trait } from '../src';

import { createPsycheDeps, createPsycheState, createTrait, createTraitFactory } from './helpers';

describe('Psyche', () => {
  describe('#react', () => {
    it('Передаёт поступок черте', () => {
      const conscientiousness = createTrait();
      const psyche = new Psyche(
        createPsycheState(),
        createPsycheDeps({
          [Trait.Conscientiousness]: createTraitFactory(conscientiousness),
        })
      );

      psyche.react(Deed.Begging);

      expect(conscientiousness.react).toHaveBeenCalledExactlyOnceWith(Deed.Begging);
    });

    it('Меняет чувство на вклад черты', () => {
      const state = createPsycheState({
        feelings: { [Feeling.Shame]: 30 },
      });
      const psyche = new Psyche(
        state,
        createPsycheDeps({
          [Trait.Conscientiousness]: createTraitFactory(createTrait({ [Feeling.Shame]: 5 })),
        })
      );

      psyche.react(Deed.Begging);

      expect(psyche.getState().feelings).toStrictEqual({ [Feeling.Shame]: 35 });
    });

    it('Если черта не меняет чувство, оставляет его как есть', () => {
      const state = createPsycheState({
        feelings: { [Feeling.Shame]: 30 },
      });
      const psyche = new Psyche(
        state,
        createPsycheDeps({
          [Trait.Conscientiousness]: createTraitFactory(createTrait({})),
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
          [Trait.Conscientiousness]: createTraitFactory(createTrait({ [Feeling.Shame]: 20 })),
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
          [Trait.Conscientiousness]: createTraitFactory(createTrait({ [Feeling.Shame]: -20 })),
        })
      );

      psyche.react(Deed.BottleFound);

      expect(psyche.getState().feelings).toStrictEqual({ [Feeling.Shame]: MIN_FEELING });
    });

    it('Если вклад не конечное число, выбрасывает RangeError и не меняет чувства', () => {
      const state = createPsycheState({
        feelings: { [Feeling.Shame]: 30 },
      });
      const psyche = new Psyche(
        state,
        createPsycheDeps({
          [Trait.Conscientiousness]: createTraitFactory(createTrait({ [Feeling.Shame]: NaN })),
        })
      );

      expect(() => psyche.react(Deed.Begging)).toThrow(RangeError);
      expect(psyche.getState().feelings).toStrictEqual({ [Feeling.Shame]: 30 });
    });
  });
});
