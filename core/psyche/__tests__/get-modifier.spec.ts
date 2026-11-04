import { describe, expect, it } from 'vitest';

import {
  createPsycheDeps,
  createPsycheState,
  createMockedTrait,
  createMockedTraitFactory,
} from '../dev';
import { Modifier, Psyche, Trait } from '../src';

describe('Psyche', () => {
  describe('#getModifier', () => {
    it('Если ни одна черта не меняет модификатор, возвращает 1', () => {
      const psyche = new Psyche(createPsycheState(), createPsycheDeps());

      expect(psyche.getModifier(Modifier.Chance)).toBe(1);
    });

    it('Возвращает вклад черты в модификатор', () => {
      const psyche = new Psyche(
        createPsycheState(),
        createPsycheDeps({
          [Trait.Luck]: createMockedTraitFactory(createMockedTrait({}, { [Modifier.Chance]: 1.5 })),
        })
      );

      expect(psyche.getModifier(Modifier.Chance)).toBe(1.5);
    });

    it('Перемножает вклады черт в один модификатор', () => {
      const psyche = new Psyche(
        createPsycheState(),
        createPsycheDeps({
          [Trait.Conscientiousness]: createMockedTraitFactory(
            createMockedTrait({}, { [Modifier.Chance]: 0.5 })
          ),
          [Trait.Luck]: createMockedTraitFactory(createMockedTrait({}, { [Modifier.Chance]: 1.5 })),
        })
      );

      expect(psyche.getModifier(Modifier.Chance)).toBe(0.75);
    });

    it('Если вклад не конечное число, выбрасывает RangeError', () => {
      const psyche = new Psyche(
        createPsycheState(),
        createPsycheDeps({
          [Trait.Luck]: createMockedTraitFactory(
            createMockedTrait({}, { [Modifier.Chance]: Infinity })
          ),
        })
      );

      expect(() => psyche.getModifier(Modifier.Chance)).toThrow(RangeError);
    });

    it('Если вклад отрицательный, выбрасывает RangeError', () => {
      const psyche = new Psyche(
        createPsycheState(),
        createPsycheDeps({
          [Trait.Luck]: createMockedTraitFactory(createMockedTrait({}, { [Modifier.Chance]: -1 })),
        })
      );

      expect(() => psyche.getModifier(Modifier.Chance)).toThrow(RangeError);
    });
  });
});
