import { describe, expect, it } from 'vitest';

import { Memory } from '../src';
import type { Fact } from '../src';

describe('Memory', () => {
  describe('#clone', () => {
    it('Возвращает память, в которую можно запоминать', () => {
      const memory = new Memory();
      const fact: Fact = {
        type: 'placeTaken',
        details: { placeId: 'begging-spot-1' },
        rememberedAt: {
          day: 1,
          hours: 10,
          minutes: 0,
        },
      };

      const clone = memory.clone();

      clone.remember(fact);

      expect(clone.recall('placeTaken')).toStrictEqual([fact]);
    });

    it('Помнит те же факты, что и исходная память', () => {
      const memory = new Memory();
      const fact: Fact = {
        type: 'placeTaken',
        details: { placeId: 'begging-spot-1' },
        rememberedAt: {
          day: 1,
          hours: 10,
          minutes: 0,
        },
      };

      memory.remember(fact);

      const clone = memory.clone();

      expect(clone.recall('placeTaken')).toStrictEqual([fact]);
    });

    it('Не меняет исходную память: факты из копии в ней не появляются', () => {
      const memory = new Memory();
      const fact: Fact = {
        type: 'placeTaken',
        details: { placeId: 'begging-spot-1' },
        rememberedAt: {
          day: 1,
          hours: 10,
          minutes: 0,
        },
      };

      const clone = memory.clone();

      clone.remember(fact);

      expect(memory.recall('placeTaken')).toStrictEqual([]);
    });

    it('Не забирает факты, которые запомнили в исходную память после копирования', () => {
      const memory = new Memory();
      const fact: Fact = {
        type: 'placeTaken',
        details: { placeId: 'begging-spot-1' },
        rememberedAt: {
          day: 1,
          hours: 10,
          minutes: 0,
        },
      };

      const clone = memory.clone();

      memory.remember(fact);

      expect(clone.recall('placeTaken')).toStrictEqual([]);
    });
  });
});
