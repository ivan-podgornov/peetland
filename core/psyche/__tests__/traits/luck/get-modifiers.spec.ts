import { describe, expect, it } from 'vitest';

import { Modifier } from '../../../src';
import { Luck } from '../../../src/traits';
import { LUCK_CHANCE_SPREAD, MAX_LUCK, MIN_LUCK } from '../../../src/traits/luck';

describe('Luck', () => {
  describe('#getModifiers', () => {
    it('При средней удачливости не меняет шанс', () => {
      const luck = new Luck((MIN_LUCK + MAX_LUCK) / 2);

      expect(luck.getModifiers()[Modifier.Chance]).toBeCloseTo(1);
    });

    it('При максимальной удачливости умножает шанс на LUCK_CHANCE_SPREAD', () => {
      const luck = new Luck(MAX_LUCK);

      expect(luck.getModifiers()[Modifier.Chance]).toBeCloseTo(LUCK_CHANCE_SPREAD);
    });

    it('При минимальной удачливости делит шанс на LUCK_CHANCE_SPREAD', () => {
      const luck = new Luck(MIN_LUCK);

      expect(luck.getModifiers()[Modifier.Chance]).toBeCloseTo(1 / LUCK_CHANCE_SPREAD);
    });

    it('На середине между средней и максимальной удачливостью умножает шанс на корень из LUCK_CHANCE_SPREAD', () => {
      const luck = new Luck(75);

      expect(luck.getModifiers()[Modifier.Chance]).toBeCloseTo(Math.sqrt(LUCK_CHANCE_SPREAD));
    });

    it('Меняет только шанс', () => {
      const luck = new Luck(MAX_LUCK);

      expect(Object.keys(luck.getModifiers())).toStrictEqual([Modifier.Chance]);
    });
  });
});
