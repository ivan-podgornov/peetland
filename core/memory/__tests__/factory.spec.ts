import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { Memory } from '../src';
import { MemoryFactory } from '../src';

describe('MemoryFactory', () => {
  describe('#create', () => {
    it('Возвращает экземпляр Memory', () => {
      const factory = new MemoryFactory();

      expect(factory.create(new ManualTime())).toBeInstanceOf(Memory);
    });

    it('Ставит на записях момент времени, который передали фабрике', () => {
      const time = new ManualTime({
        day: 3,
        hours: 21,
        minutes: 10,
      });
      const factory = new MemoryFactory();

      const memory = factory.create(time);

      memory.remember('placeTaken', { placeId: 'begging-spot-1' });

      expect(memory.recall('placeTaken')[0]?.rememberedAt).toStrictEqual({
        day: 3,
        hours: 21,
        minutes: 10,
      });
    });
  });
});
