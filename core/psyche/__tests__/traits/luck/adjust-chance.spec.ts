import { describe, expect, it } from 'vitest';

import { Luck } from '../../../src/traits';

describe('Luck', () => {
  describe('#adjustChance', () => {
    it('При средней удачливости возвращает шанс как есть', () => {
      const luck = new Luck((Luck.MIN + Luck.MAX) / 2);

      expect(luck.adjustChance(1 / 40)).toBeCloseTo(1 / 40);
    });

    it('При максимальной удачливости умножает соотношение удач и неудач на Luck.CHANCE_SPREAD', () => {
      const luck = new Luck(Luck.MAX);

      // Соотношение 1 к 1 становится 1.5 к 1
      expect(luck.adjustChance(0.5)).toBeCloseTo(0.6);
    });

    it('При минимальной удачливости делит соотношение удач и неудач на Luck.CHANCE_SPREAD', () => {
      const luck = new Luck(Luck.MIN);

      // Соотношение 1 к 1 становится 1 к 1.5
      expect(luck.adjustChance(0.5)).toBeCloseTo(0.4);
    });

    it('На середине между средней и максимальной удачливостью умножает соотношение на √Luck.CHANCE_SPREAD', () => {
      const luck = new Luck(75);

      const odds = Math.sqrt(1.5);
      expect(luck.adjustChance(0.5)).toBeCloseTo(odds / (1 + odds));
    });

    it('Если шанс 1, возвращает 1', () => {
      const luck = new Luck(Luck.MIN);

      expect(luck.adjustChance(1)).toBe(1);
    });

    it('Если шанс 0, возвращает 0', () => {
      const luck = new Luck(Luck.MAX);

      expect(luck.adjustChance(0)).toBe(0);
    });
  });
});
