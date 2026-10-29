import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { createCommand, executeCommand, UPDATE_PERIOD } from './helpers';

describe('Command', () => {
  describe('#cancel', () => {
    it('Завершает Observable ошибкой reason', () => {
      const reason = new Error('Прервана');
      const error = vi.fn();
      const command = executeCommand({ observer: { error } });

      command.cancel(reason);

      expect(error).toHaveBeenCalledExactlyOnceWith(reason);
    });

    it("Вызывает onFinish с 'cancelled'", () => {
      const onFinish = vi.fn();
      const command = executeCommand({ hooks: { onFinish } });

      command.cancel(new Error());

      expect(onFinish).toHaveBeenCalledExactlyOnceWith('cancelled');
    });

    it('Больше не вызывает onUpdate', () => {
      const timer = new ManualTimer();
      const onUpdate = vi.fn(() => 'running' as const);
      const command = executeCommand({ hooks: { onUpdate }, timer });

      command.cancel(new Error());
      timer.advance(UPDATE_PERIOD);

      expect(onUpdate).toHaveBeenCalledOnce();
    });

    it('Если команда уже прервана, не вызывает onFinish повторно', () => {
      const onFinish = vi.fn();
      const command = executeCommand({ hooks: { onFinish } });
      command.cancel(new Error());

      command.cancel(new Error());

      expect(onFinish).toHaveBeenCalledOnce();
    });

    it("Если команда выполнена, onFinish остаётся вызванным только с 'success'", () => {
      const onFinish = vi.fn();
      const command = executeCommand({ hooks: { onUpdate: () => 'success', onFinish } });

      command.cancel(new Error());

      expect(onFinish).toHaveBeenCalledExactlyOnceWith('success');
    });

    describe('Если на Observable ещё не подписались', () => {
      it('При подписке завершает Observable ошибкой reason', () => {
        const reason = new Error('Прервана');
        const error = vi.fn();
        const command = createCommand();
        command.cancel(reason);

        command.execute().subscribe({ error });

        expect(error).toHaveBeenCalledExactlyOnceWith(reason);
      });

      it('При подписке не вызывает onStart', () => {
        const onStart = vi.fn();
        const command = createCommand({ hooks: { onStart } });
        command.cancel(new Error());

        command.execute().subscribe();

        expect(onStart).not.toHaveBeenCalled();
      });

      it('При подписке не вызывает onFinish', () => {
        const onFinish = vi.fn();
        const command = createCommand({ hooks: { onFinish } });
        command.cancel(new Error());

        command.execute().subscribe();

        expect(onFinish).not.toHaveBeenCalled();
      });
    });
  });
});
