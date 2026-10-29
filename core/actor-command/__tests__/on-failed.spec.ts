import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { executeCommand, UPDATE_PERIOD } from './helpers';

describe('Command', () => {
  describe("Если onUpdate вернул 'failed'", () => {
    it('Завершает Observable ошибкой', () => {
      const error = vi.fn();

      executeCommand({ hooks: { onUpdate: () => 'failed' }, observer: { error } });

      expect(error).toHaveBeenCalledExactlyOnceWith(expect.any(Error));
    });

    it("Вызывает onFinish с 'failed'", () => {
      const onFinish = vi.fn();

      executeCommand({ hooks: { onUpdate: () => 'failed', onFinish } });

      expect(onFinish).toHaveBeenCalledExactlyOnceWith('failed');
    });

    it('Больше не вызывает onUpdate', () => {
      const timer = new ManualTimer();
      const onUpdate = vi.fn(() => 'failed' as const);
      executeCommand({ hooks: { onUpdate }, timer });

      timer.advance(UPDATE_PERIOD);

      expect(onUpdate).toHaveBeenCalledOnce();
    });
  });
});
