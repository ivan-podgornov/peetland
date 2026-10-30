import { describe, expect, it, vi } from 'vitest';

import { ActorCommandSlot } from '../../src';
import { ManualCommand } from '../helpers';

describe('ActorCommandSlot', () => {
  describe('#cancel', () => {
    it('Завершает Observable текущей команды ошибкой reason', () => {
      const slot = new ActorCommandSlot();
      const error = vi.fn();
      const reason = new Error('Актор деспавнен');
      slot.bind(new ManualCommand()).execute().subscribe({ error });

      slot.cancel(reason);

      expect(error).toHaveBeenCalledExactlyOnceWith(reason);
    });

    it('Текущей команды после этого нет', () => {
      const slot = new ActorCommandSlot();
      slot.bind(new ManualCommand()).execute().subscribe();

      slot.cancel(new Error());

      expect(slot.current).toBeNull();
    });

    it('Если текущей команды нет, ничего не выбрасывает', () => {
      const slot = new ActorCommandSlot();

      expect(() => slot.cancel(new Error())).not.toThrow();
    });
  });
});
