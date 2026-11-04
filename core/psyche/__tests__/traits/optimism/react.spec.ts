import { describe, expect, it } from 'vitest';

import { Deed } from '../../../src';
import type { ITrait } from '../../../src';
import { Optimism } from '../../../src/traits';

describe('Optimism', () => {
  describe('#react', () => {
    it.each(Object.values(Deed))('На поступок %s не меняет чувства', (deed) => {
      const optimism: ITrait = new Optimism(50);

      expect(optimism.react(deed)).toStrictEqual({});
    });
  });
});
