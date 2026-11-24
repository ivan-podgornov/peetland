import { describe, expect, it } from 'vitest';

import { Memory } from '../src';
import { MemoryFactory } from '../src';

describe('MemoryFactory', () => {
  describe('#create', () => {
    it('Возвращает экземпляр Memory', () => {
      const factory = new MemoryFactory();

      expect(factory.create()).toBeInstanceOf(Memory);
    });
  });
});
