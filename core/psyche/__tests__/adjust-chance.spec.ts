import { describe, expect, it } from 'vitest';

import {
  createMockedLuck,
  createMockedTraitFactory,
  createPsycheDeps,
  createPsycheState,
} from '../dev';
import { Psyche, Trait } from '../src';

describe('Psyche', () => {
  describe('#adjustChance', () => {
    it('Передаёт удачливости базовый шанс', () => {
      const luck = createMockedLuck();
      const psyche = new Psyche(
        createPsycheState(),
        createPsycheDeps({ [Trait.Luck]: createMockedTraitFactory(luck) })
      );

      psyche.adjustChance(1 / 40);

      expect(luck.adjustChance).toHaveBeenCalledExactlyOnceWith(1 / 40);
    });

    it('Возвращает шанс, который поправила удачливость', () => {
      const luck = createMockedLuck();
      luck.adjustChance.mockReturnValue(1 / 27);
      const psyche = new Psyche(
        createPsycheState(),
        createPsycheDeps({ [Trait.Luck]: createMockedTraitFactory(luck) })
      );

      expect(psyche.adjustChance(1 / 40)).toBe(1 / 27);
    });
  });
});
