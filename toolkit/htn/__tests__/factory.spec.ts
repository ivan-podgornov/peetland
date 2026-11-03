import { describe, expect, it } from 'vitest';

import { primitive } from '../dev';
import { HTN, HTNFactory } from '../src';

describe('HTNFactory', () => {
  describe('#create', () => {
    it('Возвращает экземпляр HTN', () => {
      const factory = new HTNFactory();

      const htn = factory.create(primitive('Primitive Task'));

      expect(htn).toBeInstanceOf(HTN);
    });
  });
});
