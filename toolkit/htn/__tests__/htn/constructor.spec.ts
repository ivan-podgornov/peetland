import { describe, expect, it, vi } from 'vitest';

import { primitive } from '../../dev';
import { HTN } from '../../src/htn';

describe('HTN', () => {
  describe('#constructor', () => {
    it('Не начинает выполнение пока не вызывался метод update', () => {
      const root = primitive('Primitive Task');
      const htn = new HTN(root);
      const updateHtnSpy = vi.spyOn(htn, 'update');

      expect(updateHtnSpy).not.toHaveBeenCalled();
    });
  });
});
