import { describe, expect, it } from 'vitest';

import { createPsycheDeps, createPsycheState, createMockedTraitFactory } from '../dev';
import { Feeling, Psyche, Trait } from '../src';

describe('Psyche', () => {
  describe('#constructor', () => {
    it('Создаёт каждую черту фабрикой этой черты со значением из состояния', () => {
      const conscientiousness = createMockedTraitFactory();
      const luck = createMockedTraitFactory();
      const state = createPsycheState({
        traits: {
          [Trait.Conscientiousness]: 70,
          [Trait.Luck]: 20,
        },
      });

      new Psyche(
        state,
        createPsycheDeps({
          [Trait.Conscientiousness]: conscientiousness,
          [Trait.Luck]: luck,
        })
      );

      expect(conscientiousness.create).toHaveBeenCalledExactlyOnceWith(70);
      expect(luck.create).toHaveBeenCalledExactlyOnceWith(20);
    });

    it('Если чувство меньше MIN_FEELING, выбрасывает RangeError', () => {
      const state = createPsycheState({
        feelings: { [Feeling.Shame]: -1 },
      });

      expect(() => new Psyche(state, createPsycheDeps())).toThrow(RangeError);
    });

    it('Если чувство больше MAX_FEELING, выбрасывает RangeError', () => {
      const state = createPsycheState({
        feelings: { [Feeling.Shame]: 101 },
      });

      expect(() => new Psyche(state, createPsycheDeps())).toThrow(RangeError);
    });

    it('Если чувство не число, выбрасывает RangeError', () => {
      const state = createPsycheState({
        feelings: { [Feeling.Shame]: NaN },
      });

      expect(() => new Psyche(state, createPsycheDeps())).toThrow(RangeError);
    });
  });
});
