import { describe, expect, it } from 'vitest';

import {
  blockedPrimitive,
  compound,
  method,
  spyMethod,
  spyPrimitive,
  testState,
} from '../../../dev';
import type { TestState } from '../../../dev';
import { Planner } from '../../../src/planner';

describe('Planner', () => {
  describe('#plan', () => {
    describe('Эффекты', () => {
      it('Предусловия метода не учитывает эффекты его детей-задач', () => {
        const planner = new Planner<TestState>();
        const afterSetter: TestState = {
          ...testState,
          counter: 1,
        };
        const setter = spyPrimitive('Setter', afterSetter);
        const testedMethod = spyMethod('Method', setter);
        const root = compound('Compound', testedMethod);

        planner.plan(root, testState);

        expect(testedMethod.preconditions).toHaveBeenCalledTimes(1);
        expect(testedMethod.preconditions).toHaveBeenCalledWith(testState);
      });

      it('Следующий метод не учитывает эффекты метода-соседа, который не удалось выполнить', () => {
        const planner = new Planner<TestState>();
        const afterSetter: TestState = {
          ...testState,
          counter: 1,
        };
        const setter = spyPrimitive('Setter', afterSetter);
        const nextMethod = spyMethod('Next method', spyPrimitive('Primitive'));
        const root = compound(
          'Compound',
          method('Failed method', setter, blockedPrimitive('Blocked')),
          nextMethod
        );

        planner.plan(root, testState);

        expect(nextMethod.preconditions).toHaveBeenCalledTimes(1);
        expect(nextMethod.preconditions).toHaveBeenCalledWith(testState);
      });

      it('Примитив метода не учитывает эффекты метода-соседа, который не удалось выполнить', () => {
        const planner = new Planner<TestState>();
        const afterSetter: TestState = {
          ...testState,
          counter: 1,
        };
        const setter = spyPrimitive('Setter', afterSetter);
        const nextPrimitive = spyPrimitive('Primitive');
        const root = compound(
          'Compound',
          method('Failed method', setter, blockedPrimitive('Blocked')),
          method('Next method', nextPrimitive)
        );

        planner.plan(root, testState);

        expect(nextPrimitive.canExecute).toHaveBeenCalledTimes(1);
        expect(nextPrimitive.canExecute).toHaveBeenCalledWith(testState);
      });
    });
  });
});
