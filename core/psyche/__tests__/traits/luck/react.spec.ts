import { describe, expect, it } from 'vitest';

import { Deed, Luck } from '../../../src';

describe('Luck', () => {
  describe('#react', () => {
    it.each(Object.values(Deed))('На поступок %s не меняет чувства', (deed) => {
      const luck = new Luck();

      expect(luck.react(deed)).toStrictEqual({});
    });
  });
});
