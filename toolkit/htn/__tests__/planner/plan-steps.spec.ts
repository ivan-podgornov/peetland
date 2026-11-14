import { describe, expect, it } from 'vitest';

import { blockedMethod, compound, method, primitive, testState } from '../../dev';
import type { TestState } from '../../dev';
import { Planner } from '../../src/planner';

describe('Planner', () => {
  describe('#plan', () => {
    describe('Шаги плана', () => {
      it('Если корневая задача примитивная, её шаг не часть составной задачи', () => {
        const planner = new Planner<TestState>();

        const [step] = planner.plan(primitive('Walk'), testState) ?? [];

        expect(step?.isPartOf).toBeNull();
      });

      it('Шаг задачи метода — часть узла с составной задачей и методом, которым её разложили', () => {
        const planner = new Planner<TestState>();
        const chosen = method('Chosen', primitive('Walk'));
        const root = compound('Root', blockedMethod('Blocked', primitive('Run')), chosen);

        const [step] = planner.plan(root, testState) ?? [];

        expect(step?.isPartOf).toStrictEqual({
          task: root,
          method: chosen,
          isPartOf: null,
        });
      });

      it('Узел вложенной составной задачи — часть узла родительской, и цепочка приводит к корню', () => {
        const planner = new Planner<TestState>();
        const purchase = compound('Purchase', method('Pay', primitive('Give money')));
        const root = compound('Root', method('Live', purchase));

        const [step] = planner.plan(root, testState) ?? [];

        expect(step?.isPartOf?.task).toBe(purchase);
        expect(step?.isPartOf?.isPartOf?.task).toBe(root);
      });

      it('Задача после вложенной составной задачи — часть узла родительской', () => {
        const planner = new Planner<TestState>();
        const purchase = compound('Purchase', method('Pay', primitive('Give money')));
        const root = compound('Root', method('Live', purchase, primitive('Go home')));

        const [giveMoney, goHome] = planner.plan(root, testState) ?? [];

        expect(goHome?.isPartOf).toBe(giveMoney?.isPartOf?.isPartOf);
      });

      it('Задачи одного разложения — часть одного узла', () => {
        const planner = new Planner<TestState>();
        const root = compound('Root', method('Purchase', primitive('Pay'), primitive('Take')));

        const [pay, take] = planner.plan(root, testState) ?? [];

        expect(take?.isPartOf).toBe(pay?.isPartOf);
      });

      it('Если составную задачу запланировали дважды, её задачи — части разных узлов', () => {
        const planner = new Planner<TestState>();
        const purchase = compound('Purchase', method('Pay', primitive('Give money')));
        const root = compound('Root', method('Live', purchase, purchase));

        const [first, second] = planner.plan(root, testState) ?? [];

        expect(second?.isPartOf).not.toBe(first?.isPartOf);
      });
    });
  });
});
