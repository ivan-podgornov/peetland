import { describe, expect, it } from 'vitest';

import { Deed } from '../../../src';
import type { ITrait } from '../../../src';
import { Luck } from '../../../src/traits';

describe('Luck', () => {
  describe('#react', () => {
    it.each(Object.values(Deed))('На поступок %s не меняет чувства', (deed) => {
      const luck: ITrait = new Luck(50);

      expect(luck.react(deed)).toStrictEqual({});
    });
  });
});
