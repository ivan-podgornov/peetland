import { describe, expect, it } from 'vitest';

import {
  createPsycheDeps,
  createPsycheState,
  createMockedTrait,
  createMockedTraitFactory,
} from '../dev';
import { Deed, Feeling, Psyche, Trait } from '../src';

describe('Psyche', () => {
  describe('#getState', () => {
    it('Возвращает черты, с которыми создана психика', () => {
      const state = createPsycheState({
        traits: {
          [Trait.Conscientiousness]: 70,
          [Trait.Luck]: 20,
        },
      });
      const psyche = new Psyche(state, createPsycheDeps());

      expect(psyche.getState().traits).toStrictEqual({
        [Trait.Conscientiousness]: 70,
        [Trait.Luck]: 20,
      });
    });

    it('Если психика ещё не реагировала на поступки, возвращает чувства, с которыми она создана', () => {
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
          [Trait.Conscientiousness]: createMockedTraitFactory(
            createMockedTrait({ [Feeling.Shame]: 5 })
          ),
        })
      );
      const snapshot = psyche.getState();

      psyche.react(Deed.Begging);

      expect(snapshot.feelings).toStrictEqual({ [Feeling.Shame]: 30 });
    });
  });
});
