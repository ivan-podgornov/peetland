import { describe, expect, it } from 'vitest';

import {
  createMockedTrait,
  createMockedTraitFactory,
  createPsycheDeps,
  createPsycheState,
} from '../dev';
import { Deed, Feeling, Psyche, Trait } from '../src';

describe('Psyche', () => {
  describe('#clone', () => {
    it('Возвращает психику с теми же чертами и чувствами', () => {
      const state = createPsycheState({
        traits: {
          [Trait.Conscientiousness]: 70,
          [Trait.Luck]: 20,
          [Trait.Optimism]: 80,
        },
        feelings: { [Feeling.Shame]: 30 },
      });
      const psyche = new Psyche(state, createPsycheDeps());

      expect(psyche.clone().getState()).toStrictEqual(psyche.getState());
    });

    it('Возвращает новый экземпляр Psyche', () => {
      const psyche = new Psyche(createPsycheState(), createPsycheDeps());

      expect(psyche.clone()).not.toBe(psyche);
    });

    it('Собирает черты копии теми же фабриками черт', () => {
      const conscientiousness = createMockedTraitFactory();
      const psyche = new Psyche(
        createPsycheState({
          traits: {
            [Trait.Conscientiousness]: 70,
            [Trait.Luck]: 20,
            [Trait.Optimism]: 80,
          },
        }),
        createPsycheDeps({ [Trait.Conscientiousness]: conscientiousness })
      );
      conscientiousness.create.mockClear();

      psyche.clone();

      expect(conscientiousness.create).toHaveBeenCalledExactlyOnceWith(70);
    });

    it('Реакция копии на поступок не меняет исходную психику', () => {
      const psyche = new Psyche(
        createPsycheState({ feelings: { [Feeling.Shame]: 30 } }),
        createPsycheDeps({
          [Trait.Conscientiousness]: createMockedTraitFactory(
            createMockedTrait({ [Feeling.Shame]: 5 })
          ),
        })
      );
      const copy = psyche.clone();

      copy.react(Deed.Begging);

      expect(psyche.getState().feelings[Feeling.Shame]).toBe(30);
    });

    it('Реакция исходной психики на поступок не меняет копию', () => {
      const psyche = new Psyche(
        createPsycheState({ feelings: { [Feeling.Shame]: 30 } }),
        createPsycheDeps({
          [Trait.Conscientiousness]: createMockedTraitFactory(
            createMockedTrait({ [Feeling.Shame]: 5 })
          ),
        })
      );
      const copy = psyche.clone();

      psyche.react(Deed.Begging);

      expect(copy.getState().feelings[Feeling.Shame]).toBe(30);
    });
  });
});
