import { describe, expect, it } from 'vitest';

import {
  createMockedOptimism,
  createMockedTraitFactory,
  createPsycheDeps,
  createPsycheState,
} from '../dev';
import { Psyche, Trait } from '../src';

describe('Psyche', () => {
  describe('#expectAttempts', () => {
    it('Передаёт оптимизму шанс', () => {
      const optimism = createMockedOptimism();
      const psyche = new Psyche(
        createPsycheState(),
        createPsycheDeps({ [Trait.Optimism]: createMockedTraitFactory(optimism) })
      );

      psyche.expectAttempts(1 / 40);

      expect(optimism.expectAttempts).toHaveBeenCalledExactlyOnceWith(1 / 40);
    });

    it('Возвращает число попыток, которое ожидает оптимизм', () => {
      const optimism = createMockedOptimism();
      optimism.expectAttempts.mockReturnValue(20);
      const psyche = new Psyche(
        createPsycheState(),
        createPsycheDeps({ [Trait.Optimism]: createMockedTraitFactory(optimism) })
      );

      expect(psyche.expectAttempts(1 / 40)).toBe(20);
    });
  });
});
