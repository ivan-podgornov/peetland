import { describe, expect, it } from 'vitest';

import { createMockedNeed, createMockedNeedFactory, createNeedsState } from '../dev';
import { Need, NeedCategory, Needs } from '../src';

describe('Needs', () => {
  describe('#getCategory', () => {
    it('Возвращает категорию потребности', () => {
      const need = {
        ...createMockedNeed(),
        category: NeedCategory.Addiction,
      };
      const needs = new Needs(createNeedsState(), {
        needFactory: createMockedNeedFactory(need),
      });

      expect(needs.getCategory(Need.Alcoholism)).toBe(NeedCategory.Addiction);
    });
  });
});
