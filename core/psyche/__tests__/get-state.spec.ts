import { describe, expect, it } from 'vitest';

import { Deed, Feeling, Psyche, Trait } from '../src';

import { createPsycheDeps, createPsycheState, createTrait, createTraitFactory } from './helpers';

describe('Psyche', () => {
  describe('#getState', () => {
    it('Возвращает черты из начального состояния', () => {
      const state = createPsycheState({
        traits: { [Trait.Conscientiousness]: 70 },
      });
      const psyche = new Psyche(state, createPsycheDeps());

      expect(psyche.getState().traits).toStrictEqual({ [Trait.Conscientiousness]: 70 });
    });

    it('Возвращает чувства из начального состояния', () => {
      const state = createPsycheState({
        feelings: { [Feeling.Shame]: 30 },
      });
      const psyche = new Psyche(state, createPsycheDeps());

      expect(psyche.getState().feelings).toStrictEqual({ [Feeling.Shame]: 30 });
    });

    it('Возвращает слепок, который не меняется, когда психика реагирует на поступок', () => {
      const state = createPsycheState({
        feelings: { [Feeling.Shame]: 30 },
      });
      const psyche = new Psyche(
        state,
        createPsycheDeps({
          [Trait.Conscientiousness]: createTraitFactory(createTrait({ [Feeling.Shame]: 5 })),
        })
      );
      const snapshot = psyche.getState();

      psyche.react(Deed.Begging);

      expect(snapshot.feelings).toStrictEqual({ [Feeling.Shame]: 30 });
    });
  });
});
