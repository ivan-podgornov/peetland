import { describe, expect, it } from 'vitest';

import { compound, method, spyMethod, spyPrimitive, testState } from '../../../dev';
import type { TestState } from '../../../dev';
import { Planner } from '../../../src/planner';

describe('Planner', () => {
  describe('#plan', () => {
    describe('Эффекты', () => {
      it('Примитив учитывает эффекты соседнего примитива, идущего перед ним', () => {
        const planner = new Planner<TestState>();
        const afterSetter: TestState = {
          ...testState,
          counter: 1,
        };
        const setter = spyPrimitive('Setter', afterSetter);
        const reader = spyPrimitive('Reader');
        const root = compound('Compound', method('Method', setter, reader));

        planner.plan(root, testState);

        expect(reader.canExecute).toHaveBeenCalledTimes(1);
        expect(reader.canExecute).toHaveBeenCalledWith(afterSetter);
      });

      it('Примитив-ребёнок составной задачи учитывает эффекты детей соседней составной, идущего перед его родителем', () => {
        const planner = new Planner<TestState>();
        const afterSetter: TestState = {
          ...testState,
          counter: 1,
        };
        const setter = spyPrimitive('Setter', afterSetter);
        const reader = spyPrimitive('Reader');
        const root = compound(
          'Compound',
          method(
            'Method',
            compound('Setter compound', method('Setter method', setter)),
            compound('Reader compound', method('Reader method', reader))
          )
        );

        planner.plan(root, testState);

        expect(reader.canExecute).toHaveBeenCalledTimes(1);
        expect(reader.canExecute).toHaveBeenCalledWith(afterSetter);
      });

      it('Примитив учитывает эффекты детей соседней составной, идущей прямо перед ним', () => {
        const planner = new Planner<TestState>();
        const afterSetter: TestState = {
          ...testState,
          counter: 1,
        };
        const setter = spyPrimitive('Setter', afterSetter);
        const reader = spyPrimitive('Reader');
        const root = compound(
          'Compound',
          method('Method', compound('Setter compound', method('Setter method', setter)), reader)
        );

        planner.plan(root, testState);

        expect(reader.canExecute).toHaveBeenCalledTimes(1);
        expect(reader.canExecute).toHaveBeenCalledWith(afterSetter);
      });

      it('Методы составной задачи учитывают эффекты соседнего примитива, идущего перед ней', () => {
        const planner = new Planner<TestState>();
        const afterSetter: TestState = {
          ...testState,
          counter: 1,
        };
        const setter = spyPrimitive('Setter', afterSetter);
        const readerMethod = spyMethod('Reader method', spyPrimitive('Primitive'));
        const root = compound(
          'Compound',
          method('Method', setter, compound('Reader compound', readerMethod))
        );

        planner.plan(root, testState);

        expect(readerMethod.preconditions).toHaveBeenCalledTimes(1);
        expect(readerMethod.preconditions).toHaveBeenCalledWith(afterSetter);
      });

      it('Методы составной задачи учитывают эффекты детей соседней составной, идущей перед ней', () => {
        const planner = new Planner<TestState>();
        const afterSetter: TestState = {
          ...testState,
          counter: 1,
        };
        const setter = spyPrimitive('Setter', afterSetter);
        const readerMethod = spyMethod('Reader method', spyPrimitive('Primitive'));
        const root = compound(
          'Compound',
          method(
            'Method',
            compound('Setter compound', method('Setter method', setter)),
            compound('Reader compound', readerMethod)
          )
        );

        planner.plan(root, testState);

        expect(readerMethod.preconditions).toHaveBeenCalledTimes(1);
        expect(readerMethod.preconditions).toHaveBeenCalledWith(afterSetter);
      });
    });
  });
});
