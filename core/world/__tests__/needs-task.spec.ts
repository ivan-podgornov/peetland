import { planNames } from '@peetland/htn/dev';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { NeedsTask } from '../src/needs-task';

describe('NeedsTask', () => {
  describe('Порядок методов', () => {
    it('Пока потребностей нет, план не составляется', () => {
      const names = planNames(new NeedsTask(), NpcStateBuilder.default());

      expect(names).toBeNull();
    });
  });
});
