import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { startCommand, UPDATE_PERIOD } from './helpers';

describe('Command', () => {
  describe('#cancel', () => {
    it('Вызывает onCancel', () => {
      const onCancel = vi.fn();
      const command = startCommand({ hooks: { onCancel } });

      command.cancel(new Error());

      expect(onCancel).toHaveBeenCalledOnce();
    });

    it('Завершает Observable ошибкой reason', () => {
      const reason = new Error('Прервана');
      const error = vi.fn();
      const command = startCommand({ observer: { error } });

      command.cancel(reason);

      expect(error).toHaveBeenCalledExactlyOnceWith(reason);
    });

    it('Вызывает onCancel раньше, чем Observable завершается ошибкой', () => {
      const onCancel = vi.fn();
      const error = vi.fn();
      const command = startCommand({ hooks: { onCancel }, observer: { error } });

      command.cancel(new Error());

      expect(onCancel).toHaveBeenCalledBefore(error);
    });

    it('Больше не вызывает onUpdate', () => {
      const timer = new ManualTimer();
      const onUpdate = vi.fn(() => 'running' as const);
      const command = startCommand({ hooks: { onUpdate }, timer });

      command.cancel(new Error());
      timer.advance(UPDATE_PERIOD);

      expect(onUpdate).toHaveBeenCalledOnce();
    });

    it('Не вызывает onFinish', () => {
      const onFinish = vi.fn();
      const command = startCommand({ hooks: { onFinish } });

      command.cancel(new Error());

      expect(onFinish).not.toHaveBeenCalled();
    });

    it('Если команда уже прервана, не вызывает onCancel повторно', () => {
      const onCancel = vi.fn();
      const command = startCommand({ hooks: { onCancel } });
      command.cancel(new Error());

      command.cancel(new Error());

      expect(onCancel).toHaveBeenCalledOnce();
    });

    it('Если команда выполнена, не вызывает onCancel', () => {
      const onCancel = vi.fn();
      const command = startCommand({ hooks: { onUpdate: () => 'success', onCancel } });

      command.cancel(new Error());

      expect(onCancel).not.toHaveBeenCalled();
    });

    it('Если команде не удалось выполниться, не вызывает onCancel', () => {
      const onCancel = vi.fn();
      const command = startCommand({ hooks: { onUpdate: () => 'failed', onCancel } });

      command.cancel(new Error());

      expect(onCancel).not.toHaveBeenCalled();
    });
  });
});
