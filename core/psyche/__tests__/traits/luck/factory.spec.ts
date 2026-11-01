import { describe, expect, it } from 'vitest';

import { Luck, LuckFactory } from '../../../src';

describe('LuckFactory', () => {
  describe('#create', () => {
    it('Возвращает экземпляр Luck', () => {
      const factory = new LuckFactory();

      expect(factory.create(50)).toBeInstanceOf(Luck);
    });
  });
});
