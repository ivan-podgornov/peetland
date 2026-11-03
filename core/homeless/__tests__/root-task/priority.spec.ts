import { createStubTask, planNames } from '@peetland/htn/dev';
import type { NpcContext, NpcState } from '@peetland/npc';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { createHomelessTaskFactory } from '../../dev';
import { HomelessRootTask } from '../../src';

type HomelessTaskName = 'drink' | 'buy-booze' | 'sell-bottles' | 'beg' | 'collect-bottles';

/** Создаёт корневую задачу, в которой можно выполнить любую задачу бомжа, кроме переданных */
function createRootTask(unavailable: HomelessTaskName[] = []): HomelessRootTask {
  function stub(name: HomelessTaskName) {
    return () => createStubTask<NpcState, NpcContext>(name, !unavailable.includes(name));
  }

  return new HomelessRootTask({
    homelessTaskFactory: createHomelessTaskFactory({
      drink: stub('drink'),
      buyBooze: stub('buy-booze'),
      sellBottles: stub('sell-bottles'),
      beg: stub('beg'),
      collectBottles: stub('collect-bottles'),
    }),
  });
}

describe('HomelessRootTask', () => {
  it('Если можно бухать, планирует бухать', () => {
    const names = planNames(createRootTask(), NpcStateBuilder.default());

    expect(names).toStrictEqual(['drink']);
  });

  it('Если бухать нельзя, планирует купить пойло', () => {
    const names = planNames(createRootTask(['drink']), NpcStateBuilder.default());

    expect(names).toStrictEqual(['buy-booze']);
  });

  it('Если и купить пойло нельзя, планирует сдать бутылки', () => {
    const names = planNames(createRootTask(['drink', 'buy-booze']), NpcStateBuilder.default());

    expect(names).toStrictEqual(['sell-bottles']);
  });

  it('Если и сдать бутылки нельзя, планирует клянчить', () => {
    const names = planNames(
      createRootTask(['drink', 'buy-booze', 'sell-bottles']),
      NpcStateBuilder.default()
    );

    expect(names).toStrictEqual(['beg']);
  });

  it('Если и клянчить нельзя, планирует собирать бутылки', () => {
    const names = planNames(
      createRootTask(['drink', 'buy-booze', 'sell-bottles', 'beg']),
      NpcStateBuilder.default()
    );

    expect(names).toStrictEqual(['collect-bottles']);
  });

  it('Если и собирать бутылки нельзя, план не составляется', () => {
    const names = planNames(
      createRootTask(['drink', 'buy-booze', 'sell-bottles', 'beg', 'collect-bottles']),
      NpcStateBuilder.default()
    );

    expect(names).toBeNull();
  });
});
