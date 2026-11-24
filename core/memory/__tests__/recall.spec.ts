import { describe, expect, it } from 'vitest';

import { Memory } from '../src';

describe('Memory', () => {
  describe('#recall', () => {
    it('Возвращает только факты запрошенного типа', () => {
      const memory = new Memory();

      memory.remember({
        type: 'placeTaken',
        details: { placeId: 'begging-spot-1' },
        rememberedAt: {
          day: 1,
          hours: 10,
          minutes: 0,
        },
      });
      memory.remember({
        type: 'binSearched',
        details: { placeId: 'trash-bin-1' },
        rememberedAt: {
          day: 1,
          hours: 11,
          minutes: 0,
        },
      });

      const placeIds = memory.recall('placeTaken').map((fact) => fact.details.placeId);

      expect(placeIds).toStrictEqual(['begging-spot-1']);
    });

    it('Возвращает факты в порядке запоминания', () => {
      const memory = new Memory();

      memory.remember({
        type: 'placeTaken',
        details: { placeId: 'begging-spot-1' },
        rememberedAt: {
          day: 1,
          hours: 10,
          minutes: 0,
        },
      });
      memory.remember({
        type: 'placeTaken',
        details: { placeId: 'begging-spot-2' },
        rememberedAt: {
          day: 1,
          hours: 12,
          minutes: 0,
        },
      });

      const placeIds = memory.recall('placeTaken').map((fact) => fact.details.placeId);

      expect(placeIds).toStrictEqual(['begging-spot-1', 'begging-spot-2']);
    });

    it('Не забывает запомненное: возвращает все факты типа, сколько бы их ни запомнили', () => {
      const memory = new Memory();

      memory.remember({
        type: 'placeTaken',
        details: { placeId: 'begging-spot-1' },
        rememberedAt: {
          day: 1,
          hours: 10,
          minutes: 0,
        },
      });
      memory.remember({
        type: 'placeTaken',
        details: { placeId: 'begging-spot-2' },
        rememberedAt: {
          day: 1,
          hours: 12,
          minutes: 0,
        },
      });
      memory.remember({
        type: 'placeTaken',
        details: { placeId: 'begging-spot-3' },
        rememberedAt: {
          day: 1,
          hours: 14,
          minutes: 0,
        },
      });

      expect(memory.recall('placeTaken')).toHaveLength(3);
    });

    it('Если фактов такого типа нет, возвращает пустой список', () => {
      const memory = new Memory();

      expect(memory.recall('placeTaken')).toStrictEqual([]);
    });

    it('Возвращает факты на момент вызова: факты, запомненные после, в результат не попадают', () => {
      const memory = new Memory();

      memory.remember({
        type: 'placeTaken',
        details: { placeId: 'begging-spot-1' },
        rememberedAt: {
          day: 1,
          hours: 10,
          minutes: 0,
        },
      });
      const facts = memory.recall('placeTaken');

      memory.remember({
        type: 'placeTaken',
        details: { placeId: 'begging-spot-2' },
        rememberedAt: {
          day: 1,
          hours: 12,
          minutes: 0,
        },
      });

      expect(facts).toHaveLength(1);
    });
  });
});
