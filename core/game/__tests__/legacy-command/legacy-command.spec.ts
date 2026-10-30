import { describe, expect, it, vi } from 'vitest';

import { LegacyCommand } from '../../src';

/** Создаёт команду в старом формате, методы которой ничего не делают */
function createLegacy() {
  return { start: vi.fn(), cancel: vi.fn() };
}

describe('LegacyCommand', () => {
  it('Возвращает название, которое ему передали', () => {
    const command = new LegacyCommand('test', createLegacy);

    expect(command.name).toBe('test');
  });

  describe('#execute', () => {
    it('До подписки не создаёт команду', () => {
      const create = vi.fn(createLegacy);
      const command = new LegacyCommand('test', create);

      command.execute();

      expect(create).not.toHaveBeenCalled();
    });

    it('При подписке создаёт команду с подписчиком Observable', () => {
      const create = vi.fn(createLegacy);
      const command = new LegacyCommand('test', create);

      command.execute().subscribe();

      expect(create).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ active: true }));
    });

    it('При подписке запускает созданную команду', () => {
      const legacy = createLegacy();
      const command = new LegacyCommand('test', () => legacy);

      command.execute().subscribe();

      expect(legacy.start).toHaveBeenCalledOnce();
    });
  });

  describe('#cancel', () => {
    it('Прерывает созданную команду', () => {
      const legacy = createLegacy();
      const command = new LegacyCommand('test', () => legacy);
      const reason = new Error('Прервана');
      command.execute().subscribe();

      command.cancel(reason);

      expect(legacy.cancel).toHaveBeenCalledExactlyOnceWith(reason);
    });

    describe('Если на Observable ещё не подписались', () => {
      it('При подписке завершает Observable ошибкой reason', () => {
        const command = new LegacyCommand('test', createLegacy);
        const error = vi.fn();
        const reason = new Error('Прервана');
        command.cancel(reason);

        command.execute().subscribe({ error });

        expect(error).toHaveBeenCalledExactlyOnceWith(reason);
      });

      it('При подписке не создаёт команду', () => {
        const create = vi.fn(createLegacy);
        const command = new LegacyCommand('test', create);
        command.cancel(new Error());

        command.execute().subscribe();

        expect(create).not.toHaveBeenCalled();
      });
    });
  });
});
