import { describe, expect, it } from 'vitest';

import { Optimism, OptimismFactory } from '../../../src/traits';

describe('OptimismFactory', () => {
  describe('#create', () => {
    it('Возвращает экземпляр Optimism', () => {
      const factory = new OptimismFactory();

      expect(factory.create(50)).toBeInstanceOf(Optimism);
    });
  });
});
