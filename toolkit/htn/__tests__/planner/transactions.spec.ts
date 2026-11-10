import { describe, expect, it } from 'vitest';

import { compound, method, primitive, testState, transaction } from '../../dev';
import type { TestState } from '../../dev';
import { Planner } from '../../src/planner';

describe('Planner', () => {
  describe('#plan', () => {
    describe('Транзакции', () => {
      it('Если составная задача не транзакция, её задачи в плане вне транзакции', () => {
        const planner = new Planner<TestState>();
        const root = compound('Root', method('Method', primitive('A'), primitive('B')));

        const steps = planner.plan(root, testState) ?? [];

        expect(steps.map((step) => step.transaction)).toStrictEqual([null, null]);
      });

      it('Помечает задачи транзакции одной транзакцией', () => {
        const planner = new Planner<TestState>();
        const root = transaction('Purchase', method('Method', primitive('Pay'), primitive('Take')));

        const [pay, take] = planner.plan(root, testState) ?? [];

        expect(pay?.transaction).not.toBeNull();
        expect(take?.transaction).toBe(pay?.transaction);
      });

      it('Задачи до и после транзакции оставляет вне транзакции', () => {
        const planner = new Planner<TestState>();
        const purchase = transaction('Purchase', method('Method', primitive('Pay')));
        const root = compound(
          'Root',
          method('Method', primitive('Go to shop'), purchase, primitive('Go home'))
        );

        const [goToShop, , goHome] = planner.plan(root, testState) ?? [];

        expect(goToShop?.transaction).toBeNull();
        expect(goHome?.transaction).toBeNull();
      });

      it('Помечает задачи двух транзакций подряд разными транзакциями', () => {
        const planner = new Planner<TestState>();
        const beer = transaction('Buy beer', method('Method', primitive('Pay for beer')));
        const chips = transaction('Buy chips', method('Method', primitive('Pay for chips')));
        const root = compound('Root', method('Method', beer, chips));

        const [payForBeer, payForChips] = planner.plan(root, testState) ?? [];

        expect(payForChips?.transaction).not.toBe(payForBeer?.transaction);
      });

      it('Если одну транзакцию запланировали дважды, помечает её задачи разными транзакциями', () => {
        const planner = new Planner<TestState>();
        const purchase = transaction('Purchase', method('Method', primitive('Pay')));
        const root = compound('Root', method('Method', purchase, purchase));

        const [first, second] = planner.plan(root, testState) ?? [];

        expect(second?.transaction).not.toBe(first?.transaction);
      });

      it('Помечает задачи транзакции внутри транзакции внешней транзакцией', () => {
        const planner = new Planner<TestState>();
        const inner = transaction('Pay', method('Method', primitive('Give money')));
        const root = transaction(
          'Purchase',
          method('Method', primitive('Choose'), inner, primitive('Take'))
        );

        const steps = planner.plan(root, testState) ?? [];
        const [choose] = steps;

        expect(steps.map((step) => step.transaction)).toStrictEqual([
          choose?.transaction,
          choose?.transaction,
          choose?.transaction,
        ]);
      });
    });
  });
});
