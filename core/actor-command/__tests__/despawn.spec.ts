import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { createCommand, executeCommand, TestActor, UPDATE_PERIOD } from './helpers';

describe('Command', () => {
  describe('Если актора деспавнили во время выполнения', () => {
    it('Завершает Observable ошибкой из сигнала актора', () => {
      const actor = new TestActor();
      const error = vi.fn();
      executeCommand({ actor, observer: { error } });

      actor.despawn();

      expect(error).toHaveBeenCalledExactlyOnceWith(actor.signal.reason);
    });

    it("Вызывает onFinish с 'cancelled'", () => {
      const actor = new TestActor();
      const onFinish = vi.fn();
      executeCommand({ actor, hooks: { onFinish } });

      actor.despawn();

      expect(onFinish).toHaveBeenCalledExactlyOnceWith('cancelled');
    });

    it('Больше не вызывает onUpdate', () => {
      const timer = new ManualTimer();
      const actor = new TestActor();
      const onUpdate = vi.fn(() => 'running' as const);
      executeCommand({ actor, hooks: { onUpdate }, timer });

      actor.despawn();
      timer.advance(UPDATE_PERIOD);

      expect(onUpdate).toHaveBeenCalledOnce();
    });
  });

  describe('Если актора деспавнили после завершения команды', () => {
    it('Не вызывает onFinish повторно', () => {
      const actor = new TestActor();
      const onFinish = vi.fn();
      executeCommand({ actor, hooks: { onUpdate: () => 'success', onFinish } });

      actor.despawn();

      expect(onFinish).toHaveBeenCalledOnce();
    });

    it('Не завершает Observable ошибкой', () => {
      const actor = new TestActor();
      const error = vi.fn();
      executeCommand({ actor, hooks: { onUpdate: () => 'success' }, observer: { error } });

      actor.despawn();

      expect(error).not.toHaveBeenCalled();
    });
  });

  describe('Если актора деспавнили до подписки', () => {
    it('При подписке завершает Observable ошибкой из сигнала актора', () => {
      const actor = new TestActor();
      const error = vi.fn();
      const command = createCommand({ actor });
      actor.despawn();

      command.execute().subscribe({ error });

      expect(error).toHaveBeenCalledExactlyOnceWith(actor.signal.reason);
    });

    it('При подписке не вызывает onStart', () => {
      const actor = new TestActor();
      const onStart = vi.fn();
      const command = createCommand({ actor, hooks: { onStart } });
      actor.despawn();

      command.execute().subscribe();

      expect(onStart).not.toHaveBeenCalled();
    });

    it('При подписке не вызывает onFinish', () => {
      const actor = new TestActor();
      const onFinish = vi.fn();
      const command = createCommand({ actor, hooks: { onFinish } });
      actor.despawn();

      command.execute().subscribe();

      expect(onFinish).not.toHaveBeenCalled();
    });
  });
});
