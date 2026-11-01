import { describe, expect, it } from 'vitest';

import { Feeling, Psyche, Trait } from '../src';

import { createPsycheDeps, createPsycheState, createTraitFactory } from './helpers';

describe('Psyche', () => {
  describe('#constructor', () => {
    it('Создаёт черту фабрикой этой черты со значением из состояния', () => {
      const conscientiousness = createTraitFactory();
      const state = createPsycheState({
        traits: { [Trait.Conscientiousness]: 70 },
      });

      new Psyche(state, createPsycheDeps({ [Trait.Conscientiousness]: conscientiousness }));

      expect(conscientiousness.create).toHaveBeenCalledExactlyOnceWith(70);
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
