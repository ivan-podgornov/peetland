import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { Memory } from '../src';

describe('Memory', () => {
  describe('#remember', () => {
    it('Запоминает запись с типом, деталями и временем запоминания', () => {
      const memory = new Memory({ time: new ManualTime() });
      const details = { placeId: 'begging-spot-1' };

      memory.remember('placeTaken', details);

      expect(memory.recall('placeTaken')).toStrictEqual([
        {
          type: 'placeTaken',
          details,
          rememberedAt: {
            day: 1,
            hours: 0,
            minutes: 0,
          },
        },
      ]);
    });

    it('Ставит на записи момент игрового времени, когда её запомнили', () => {
      const time = new ManualTime({
        day: 2,
        hours: 14,
        minutes: 30,
      });
      const memory = new Memory({ time });

      memory.remember('placeTaken', { placeId: 'begging-spot-1' });

      expect(memory.recall('placeTaken')[0]?.rememberedAt).toStrictEqual({
        day: 2,
        hours: 14,
        minutes: 30,
      });
    });

    it('Ставит на каждой записи её собственный момент запоминания', () => {
      const time = new ManualTime({
        day: 1,
        hours: 10,
        minutes: 0,
      });
      const memory = new Memory({ time });

      memory.remember('placeTaken', { placeId: 'begging-spot-1' });
      time.set({
        day: 1,
        hours: 12,
        minutes: 0,
      });
      memory.remember('placeTaken', { placeId: 'begging-spot-2' });

      const records = memory.recall('placeTaken');

      expect(records[0]?.rememberedAt).toStrictEqual({
        day: 1,
        hours: 10,
        minutes: 0,
      });
      expect(records[1]?.rememberedAt).toStrictEqual({
        day: 1,
        hours: 12,
        minutes: 0,
      });
    });
  });
});
