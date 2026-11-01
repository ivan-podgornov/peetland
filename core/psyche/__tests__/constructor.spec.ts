import { describe, expect, it } from 'vitest';

import { Psyche } from '../src';

import { createPsycheState, createTraitFactory } from './helpers';

describe('Psyche', () => {
  describe('#constructor', () => {
    it('Создаёт черту фабрикой этой черты со значением из состояния', () => {
      const pride = createTraitFactory();

      new Psyche(createPsycheState({ traits: { pride: 70 } }), { traitFactories: { pride } });

      expect(pride.create).toHaveBeenCalledExactlyOnceWith(70);
    });

    it('Не создаёт черты, которых нет в состоянии', () => {
      const pride = createTraitFactory();

      new Psyche(createPsycheState({ traits: {} }), { traitFactories: { pride } });

      expect(pride.create).not.toHaveBeenCalled();
    });

    it('Если для черты нет фабрики, выбрасывает Error', () => {
      const state = createPsycheState({ traits: { pride: 70 } });

      expect(() => new Psyche(state, { traitFactories: {} })).toThrow(Error);
    });

    it('Если чувство меньше MIN_FEELING, выбрасывает RangeError', () => {
      const state = createPsycheState({ feelings: { shame: -1 } });

      expect(() => new Psyche(state, { traitFactories: {} })).toThrow(RangeError);
    });

    it('Если чувство больше MAX_FEELING, выбрасывает RangeError', () => {
      const state = createPsycheState({ feelings: { shame: 101 } });

      expect(() => new Psyche(state, { traitFactories: {} })).toThrow(RangeError);
    });

    it('Если чувство не число, выбрасывает RangeError', () => {
      const state = createPsycheState({ feelings: { shame: NaN } });

      expect(() => new Psyche(state, { traitFactories: {} })).toThrow(RangeError);
    });
  });
});
