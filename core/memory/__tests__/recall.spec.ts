import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { Memory } from '../src';
import type { MemoryMap } from '../src';

/** Карта записей для тестов: кроме занятого места — найденная бутылка */
type TestMemoryMap = MemoryMap & { bottleFound: { placeId: string } };

describe('Memory', () => {
  describe('#recall', () => {
    it('Возвращает только записи запрошенного типа', () => {
      const memory = new Memory<TestMemoryMap>({ time: new ManualTime() });

      memory.remember('placeTaken', { placeId: 'begging-spot-1' });
      memory.remember('bottleFound', { placeId: 'trash-bin-1' });

      const placeIds = memory.recall('placeTaken').map((record) => record.details.placeId);

      expect(placeIds).toStrictEqual(['begging-spot-1']);
    });

    it('Возвращает записи в порядке запоминания', () => {
      const memory = new Memory({ time: new ManualTime() });

      memory.remember('placeTaken', { placeId: 'begging-spot-1' });
      memory.remember('placeTaken', { placeId: 'begging-spot-2' });

      const placeIds = memory.recall('placeTaken').map((record) => record.details.placeId);

      expect(placeIds).toStrictEqual(['begging-spot-1', 'begging-spot-2']);
    });

    it('Не забывает запомненное: возвращает все записи типа, сколько бы их ни запомнили', () => {
      const memory = new Memory({ time: new ManualTime() });

      memory.remember('placeTaken', { placeId: 'begging-spot-1' });
      memory.remember('placeTaken', { placeId: 'begging-spot-2' });
      memory.remember('placeTaken', { placeId: 'begging-spot-3' });

      expect(memory.recall('placeTaken')).toHaveLength(3);
    });

    it('Если записей такого типа нет, возвращает пустой список', () => {
      const memory = new Memory({ time: new ManualTime() });

      expect(memory.recall('placeTaken')).toStrictEqual([]);
    });

    it('Возвращает записи на момент вызова: записи, запомненные после, в результат не попадают', () => {
      const memory = new Memory({ time: new ManualTime() });

      memory.remember('placeTaken', { placeId: 'begging-spot-1' });
      const records = memory.recall('placeTaken');

      memory.remember('placeTaken', { placeId: 'begging-spot-2' });

      expect(records).toHaveLength(1);
    });
  });
});
