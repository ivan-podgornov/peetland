import { describe, expect, it } from 'vitest';

import { Memory } from '../src';
import type { Fact } from '../src';

describe('Memory', () => {
  describe('#remember', () => {
    it('Запоминает факт вместе с моментом запоминания', () => {
      const memory = new Memory();
      const fact: Fact = {
        type: 'placeTaken',
        details: { placeId: 'begging-spot-1' },
        rememberedAt: {
          day: 2,
          hours: 14,
          minutes: 30,
        },
      };

      memory.remember(fact);

      expect(memory.recall('placeTaken')).toStrictEqual([fact]);
    });

    it('Запоминает факты разных типов', () => {
      const memory = new Memory();
      const placeTaken: Fact = {
        type: 'placeTaken',
        details: { placeId: 'begging-spot-1' },
        rememberedAt: {
          day: 1,
          hours: 10,
          minutes: 0,
        },
      };
      const binSearched: Fact = {
        type: 'binSearched',
        details: { placeId: 'trash-bin-1' },
        rememberedAt: {
          day: 1,
          hours: 11,
          minutes: 0,
        },
      };

      memory.remember(placeTaken);
      memory.remember(binSearched);

      expect(memory.recall('placeTaken')).toStrictEqual([placeTaken]);
      expect(memory.recall('binSearched')).toStrictEqual([binSearched]);
    });
  });
});
