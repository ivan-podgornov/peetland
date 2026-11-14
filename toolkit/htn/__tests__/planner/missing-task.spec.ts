import { describe, expect, it } from 'vitest';

import { compound, method, primitive, testState } from '../../dev';
import type { TestContext, TestState } from '../../dev';
import { Planner } from '../../src/planner';
import type { Task } from '../../src/task';

/** Возвращает undefined под видом задачи, как мок фабрики задач без реализации */
function createMissingTask(): Task<TestState, TestContext> {
  return undefined as unknown as Task<TestState, TestContext>;
}

describe('Planner', () => {
  describe('#plan', () => {
    describe('Если вместо задачи undefined', () => {
      it('Если среди задач метода undefined, выбрасывает TypeError, а не обрезает план', () => {
        const planner = new Planner<TestState>();
        const root = compound('Root', method('Method', createMissingTask(), primitive('Go')));

        expect(() => planner.plan(root, testState)).toThrow(TypeError);
      });

      it('Называет метод и составную задачу, которые вернули undefined', () => {
        const planner = new Planner<TestState>();
        const root = compound('Root', method('Method', createMissingTask()));

        expect(() => planner.plan(root, testState)).toThrow(
          'Метод Method задачи Root вернул undefined вместо задачи'
        );
      });

      it('Если вместо корневой задачи undefined, выбрасывает TypeError', () => {
        const planner = new Planner<TestState>();

        expect(() => planner.plan(createMissingTask(), testState)).toThrow(
          'Вместо корневой задачи передано undefined'
        );
      });
    });
  });
});
