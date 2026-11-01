import { describe, expect, it } from 'vitest';

import { Conscientiousness, ConscientiousnessFactory } from '../../../src';

describe('ConscientiousnessFactory', () => {
  describe('#create', () => {
    it('Возвращает экземпляр Conscientiousness', () => {
      const factory = new ConscientiousnessFactory();

      expect(factory.create(50)).toBeInstanceOf(Conscientiousness);
    });
  });
});
