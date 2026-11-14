import { planSteps } from '@peetland/htn/dev';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { AddictionsTask } from '../src/addictions-task';

describe('AddictionsTask', () => {
  describe('Порядок методов', () => {
    it('Пока зависимостей нет, план не составляется', () => {
      const steps = planSteps(new AddictionsTask(), NpcStateBuilder.default());

      expect(steps).toBeNull();
    });
  });
});
