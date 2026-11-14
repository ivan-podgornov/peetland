import { describe, expect, it } from 'vitest';

import { getStepNames, primitive, testState } from '../dev';
import type { TestContext, TestState } from '../dev';
import { TransactionTask } from '../src';
import { Planner } from '../src/planner';

describe('TransactionTask', () => {
  it('Является транзакцией', () => {
    const task = new TransactionTask<TestState, TestContext>('Purchase', []);

    expect(task.transaction).toBe(true);
  });

  it('Планируется в задачи транзакции по очереди', () => {
    const task = new TransactionTask('Purchase', [primitive('Pay'), primitive('Take')]);

    const steps = new Planner<TestState>().plan(task, testState) ?? [];

    expect(getStepNames(steps)).toStrictEqual(['Pay', 'Take']);
  });

  it('Задачи транзакции — части её узла', () => {
    const task = new TransactionTask('Purchase', [primitive('Pay')]);

    const [step] = new Planner<TestState>().plan(task, testState) ?? [];

    expect(step?.isPartOf?.task).toBe(task);
  });
});
