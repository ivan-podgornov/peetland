import { describe, expect, it, vi } from 'vitest';

import { Planner } from '../../src/planner';

import {
  blockedPrimitive,
  compound,
  dynamicMethod,
  getNames,
  method,
  primitive,
  spyPrimitive,
  testState,
} from '../helpers';

import type { TestState } from '../helpers';

describe('Planner', () => {
  describe('#plan', () => {
    describe('Подзадачи метода, заданные функцией', () => {
      it('Планирует задачи, которые вернула функция', () => {
        const planner = new Planner<TestState>();
        const root = compound(
          'Compound',
          dynamicMethod('Method', () => [primitive('Primitive 1'), primitive('Primitive 2')])
        );

        const tasks = planner.plan(root, testState) ?? [];

        expect(getNames(tasks)).toStrictEqual(['Primitive 1', 'Primitive 2']);
      });

      it('Передаёт функции состояние с эффектами задач, которые идут перед методом', () => {
        const planner = new Planner<TestState>();
        const afterSetter: TestState = { ...testState, counter: 1 };
        const tasks = vi.fn((_state: TestState) => [primitive('Primitive')]);
        const root = compound(
          'Compound',
          method(
            'Method',
            spyPrimitive('Setter', afterSetter),
            compound('Dynamic', dynamicMethod('Dynamic method', tasks))
          )
        );

        planner.plan(root, testState);

        expect(tasks).toHaveBeenCalledExactlyOnceWith(afterSetter);
      });

      it('Если предусловия метода не подошли, не вызывает функцию', () => {
        const planner = new Planner<TestState>();
        const tasks = vi.fn(() => [primitive('Primitive')]);
        const root = compound('Compound', dynamicMethod('Method', tasks));

        planner.plan(root, { ...testState, canExecute: false });

        expect(tasks).not.toHaveBeenCalled();
      });

      it('Если задачи, которые вернула функция, выполнить нельзя, переходит к следующему методу', () => {
        const planner = new Planner<TestState>();
        const root = compound(
          'Compound',
          dynamicMethod('Dynamic', () => [blockedPrimitive('Blocked')]),
          method('Fallback', primitive('Fallback primitive'))
        );

        const tasks = planner.plan(root, testState) ?? [];

        expect(getNames(tasks)).toStrictEqual(['Fallback primitive']);
      });
    });
  });
});
