import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { executeCommand, UPDATE_PERIOD } from './helpers';

describe('Command', () => {
  describe("Если onUpdate вернул 'success'", () => {
    it('Успешно завершает Observable', () => {
      const complete = vi.fn();

      executeCommand({
        hooks: { onUpdate: () => 'success' },
        observer: { complete },
      });

      expect(complete).toHaveBeenCalledOnce();
    });

    it("Вызывает onFinish с 'success'", () => {
      const onFinish = vi.fn();

      executeCommand({
        hooks: {
          onUpdate: () => 'success',
          onFinish,
        },
      });

      expect(onFinish).toHaveBeenCalledExactlyOnceWith('success');
    });

    it('Больше не вызывает onUpdate', () => {
      const timer = new ManualTimer();
      const onUpdate = vi.fn(() => 'success' as const);
      executeCommand({
        hooks: { onUpdate },
        timer,
      });

      timer.advance(UPDATE_PERIOD);

      expect(onUpdate).toHaveBeenCalledOnce();
    });

    it('Если команда выполнена при обновлении по таймеру, больше не вызывает onUpdate', () => {
      const timer = new ManualTimer();
      const onUpdate = vi.fn((elapsed: number) => (elapsed > 0 ? 'success' : 'running'));
      executeCommand({
        hooks: { onUpdate },
        timer,
      });

      timer.advance(UPDATE_PERIOD * 2);

      expect(onUpdate).toHaveBeenCalledTimes(2);
    });
  });
});
