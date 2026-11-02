import { describe, expect, it } from 'vitest';

import { Deed, Luck } from '../../../src';
import type { ITrait } from '../../../src';

describe('Luck', () => {
  describe('#react', () => {
    it.each(Object.values(Deed))('На поступок %s не меняет чувства', (deed) => {
      const luck: ITrait = new Luck();

      expect(luck.react(deed)).toStrictEqual({});
    });
  });
});
