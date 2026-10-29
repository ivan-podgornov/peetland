import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { startCommand, UPDATE_PERIOD } from './helpers';

describe('Command', () => {
  describe("Если onUpdate вернул 'success'", () => {
    it('Вызывает onFinish', () => {
      const onFinish = vi.fn();

      startCommand({ hooks: { onUpdate: () => 'success', onFinish } });

      expect(onFinish).toHaveBeenCalledOnce();
    });

    it('Успешно завершает Observable', () => {
      const complete = vi.fn();

      startCommand({ hooks: { onUpdate: () => 'success' }, observer: { complete } });

      expect(complete).toHaveBeenCalledOnce();
    });

    it('Вызывает onFinish раньше, чем завершается Observable', () => {
      const onFinish = vi.fn();
      const complete = vi.fn();

      startCommand({ hooks: { onUpdate: () => 'success', onFinish }, observer: { complete } });

      expect(onFinish).toHaveBeenCalledBefore(complete);
    });

    it('Больше не вызывает onUpdate', () => {
      const timer = new ManualTimer();
      const onUpdate = vi.fn(() => 'success' as const);
      startCommand({ hooks: { onUpdate }, timer });

      timer.advance(UPDATE_PERIOD);

      expect(onUpdate).toHaveBeenCalledOnce();
    });

    it('Если команда выполнена при обновлении по таймеру, больше не вызывает onUpdate', () => {
      const timer = new ManualTimer();
      const onUpdate = vi.fn((elapsed: number) => (elapsed > 0 ? 'success' : 'running'));
      startCommand({ hooks: { onUpdate }, timer });

      timer.advance(UPDATE_PERIOD * 2);

      expect(onUpdate).toHaveBeenCalledTimes(2);
    });

    it('Не вызывает onCancel', () => {
      const onCancel = vi.fn();

      startCommand({ hooks: { onUpdate: () => 'success', onCancel } });

      expect(onCancel).not.toHaveBeenCalled();
    });
  });
});
