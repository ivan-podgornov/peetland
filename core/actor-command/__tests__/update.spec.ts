import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { executeCommand, UPDATE_PERIOD } from './helpers';

describe('Command', () => {
  describe('Обновление', () => {
    it('Вызывает onUpdate раз в период обновления', () => {
      const timer = new ManualTimer();
      const onUpdate = vi.fn(() => 'running' as const);
      executeCommand({ hooks: { onUpdate }, timer });

      timer.advance(UPDATE_PERIOD * 3);

      expect(onUpdate).toHaveBeenCalledTimes(4);
    });

    it('Передаёт в onUpdate, сколько прошло с прошлого вызова', () => {
      const timer = new ManualTimer();
      const onUpdate = vi.fn(() => 'running' as const);
      executeCommand({ hooks: { onUpdate }, timer });

      timer.advance(UPDATE_PERIOD);

      expect(onUpdate).toHaveBeenLastCalledWith(UPDATE_PERIOD, expect.anything());
    });

    it('Не вызывает onUpdate, пока не прошёл период обновления', () => {
      const timer = new ManualTimer();
      const onUpdate = vi.fn(() => 'running' as const);
      executeCommand({ hooks: { onUpdate }, timer });

      timer.advance(UPDATE_PERIOD - 1);

      expect(onUpdate).toHaveBeenCalledOnce();
    });
  });
});
