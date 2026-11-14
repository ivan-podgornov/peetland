import { describe, expect, it } from 'vitest';

import { UrgencyWatcher, UrgencyWatcherFactory } from '../src';

describe('UrgencyWatcherFactory', () => {
  describe('#create', () => {
    it('Возвращает экземпляр UrgencyWatcher', () => {
      const factory = new UrgencyWatcherFactory();

      expect(factory.create()).toBeInstanceOf(UrgencyWatcher);
    });

    it('На каждый вызов возвращает нового наблюдателя', () => {
      const factory = new UrgencyWatcherFactory();

      expect(factory.create()).not.toBe(factory.create());
    });
  });
});
