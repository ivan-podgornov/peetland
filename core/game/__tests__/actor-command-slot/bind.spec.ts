import { AbortController } from '@peetland/events';
import { describe, expect, it, vi } from 'vitest';

import { ActorCommandSlot } from '../../src';
import { ManualCommand } from '../helpers';

describe('ActorCommandSlot', () => {
  describe('#bind', () => {
    it('Возвращает команду с названием обёрнутой команды', () => {
      const slot = new ActorCommandSlot();

      const command = slot.bind(new ManualCommand());

      expect(command.name).toBe('manual');
    });

    it('До подписки не делает команду текущей', () => {
      const slot = new ActorCommandSlot();
      const inner = new ManualCommand();
      const cancel = vi.spyOn(inner, 'cancel');
      slot.bind(inner);

      slot.cancel(new Error());

      expect(cancel).not.toHaveBeenCalled();
    });

    it('При подписке делает команду текущей', () => {
      const slot = new ActorCommandSlot();
      const error = vi.fn();
      slot.bind(new ManualCommand()).execute().subscribe({ error });

      slot.cancel(new Error());

      expect(error).toHaveBeenCalledExactlyOnceWith(expect.any(Error));
    });

    it('При подписке прерывает текущую команду', () => {
      const slot = new ActorCommandSlot();
      const error = vi.fn();
      slot.bind(new ManualCommand()).execute().subscribe({ error });

      slot.bind(new ManualCommand()).execute().subscribe();

      expect(error).toHaveBeenCalledExactlyOnceWith(expect.any(Error));
    });

    it('Передаёт подписчикам значения обёрнутой команды', () => {
      const slot = new ActorCommandSlot();
      const inner = new ManualCommand<number>();
      const next = vi.fn();
      slot.bind(inner).execute().subscribe({ next });

      inner.subscriber!.next(42);

      expect(next).toHaveBeenCalledExactlyOnceWith(42);
    });

    it('Завершает Observable, когда завершается обёрнутая команда', () => {
      const slot = new ActorCommandSlot();
      const inner = new ManualCommand();
      const complete = vi.fn();
      slot.bind(inner).execute().subscribe({ complete });

      inner.subscriber!.complete();

      expect(complete).toHaveBeenCalledOnce();
    });

    it('Когда команда завершилась, она перестаёт быть текущей', () => {
      const slot = new ActorCommandSlot();
      const inner = new ManualCommand();
      const cancel = vi.spyOn(inner, 'cancel');
      slot.bind(inner).execute().subscribe();
      inner.subscriber!.complete();

      slot.cancel(new Error());

      expect(cancel).not.toHaveBeenCalled();
    });

    it('Когда от команды отписались, она перестаёт быть текущей', () => {
      const slot = new ActorCommandSlot();
      const controller = new AbortController();
      const inner = new ManualCommand();
      const cancel = vi.spyOn(inner, 'cancel');
      slot.bind(inner).execute().subscribe({}, { signal: controller.signal });
      controller.abort();

      slot.cancel(new Error());

      expect(cancel).not.toHaveBeenCalled();
    });

    it('Когда от команды отписались, отписывается от обёрнутой команды', () => {
      const slot = new ActorCommandSlot();
      const controller = new AbortController();
      const inner = new ManualCommand();
      slot.bind(inner).execute().subscribe({}, { signal: controller.signal });

      controller.abort();

      expect(inner.subscriber!.active).toBe(false);
    });

    it('Когда прерванная команда завершается, новая остаётся текущей', () => {
      const slot = new ActorCommandSlot();
      const error = vi.fn();
      slot.bind(new ManualCommand()).execute().subscribe();
      slot.bind(new ManualCommand()).execute().subscribe({ error });

      slot.cancel(new Error());

      expect(error).toHaveBeenCalledExactlyOnceWith(expect.any(Error));
    });

    it('cancel прерывает обёрнутую команду', () => {
      const slot = new ActorCommandSlot();
      const inner = new ManualCommand();
      const cancel = vi.spyOn(inner, 'cancel');
      const command = slot.bind(inner);
      const reason = new Error('Прервана');

      command.cancel(reason);

      expect(cancel).toHaveBeenCalledExactlyOnceWith(reason);
    });

    describe('Если команду прервали до подписки', () => {
      it('При подписке не прерывает текущую команду', () => {
        const slot = new ActorCommandSlot();
        const error = vi.fn();
        slot.bind(new ManualCommand()).execute().subscribe({ error });
        const command = slot.bind(new ManualCommand());
        command.cancel(new Error());

        command.execute().subscribe();

        expect(error).not.toHaveBeenCalled();
      });

      it('При подписке не становится текущей', () => {
        const slot = new ActorCommandSlot();
        const inner = new ManualCommand();
        const cancel = vi.spyOn(inner, 'cancel');
        const command = slot.bind(inner);
        command.cancel(new Error());
        command.execute().subscribe();

        slot.cancel(new Error());

        expect(cancel).toHaveBeenCalledOnce();
      });
    });
  });
});
