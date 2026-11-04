import { describe, expect, it } from 'vitest';

import { Conscientiousness } from '../../../src/traits';

describe('Conscientiousness', () => {
  describe('#getModifiers', () => {
    it.each([0, 50, 100])('При совестливости %d не меняет модификаторы', (value) => {
      const conscientiousness = new Conscientiousness(value);

      expect(conscientiousness.getModifiers()).toStrictEqual({});
    });
  });
});
