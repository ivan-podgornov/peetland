import { describe, expect, it } from 'vitest';

import { HTNFactory } from '../src';
import { getDefaultDeps } from '../src/htn';

import { getDummyPlanner, primitive, testState } from './helpers';

describe('HTNFactory', () => {
  describe('#create', () => {
    it('Создаёт HTN-агента, который планирует переданную корневую задачу', () => {
      const root = primitive('Primitive Task');
      const planner = getDummyPlanner([root]);
      const factory = new HTNFactory({ ...getDefaultDeps(), plannerFactory: () => planner });

      factory.create(root).update(testState);

      expect(planner.plan).toHaveBeenCalledExactlyOnceWith(root, testState);
    });
  });
});
