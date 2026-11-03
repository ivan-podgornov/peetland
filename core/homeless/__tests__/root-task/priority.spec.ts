import { createStubTask, planNames } from '@peetland/htn/dev';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { createHomelessTaskFactory } from '../../dev';
import { HomelessRootTask } from '../../src';

describe('HomelessRootTask', () => {
  it('Если можно и бухать, и купить пойло, планирует бухать', () => {
    const homelessTaskFactory = createHomelessTaskFactory({
      drink: () => createStubTask('drink'),
      buyBooze: () => createStubTask('buy-booze'),
    });

    const names = planNames(
      new HomelessRootTask({ homelessTaskFactory }),
      NpcStateBuilder.default()
    );

    expect(names).toStrictEqual(['drink']);
  });

  it('Если бухать нельзя, планирует купить пойло', () => {
    const homelessTaskFactory = createHomelessTaskFactory({
      drink: () => createStubTask('drink', false),
      buyBooze: () => createStubTask('buy-booze'),
    });

    const names = planNames(
      new HomelessRootTask({ homelessTaskFactory }),
      NpcStateBuilder.default()
    );

    expect(names).toStrictEqual(['buy-booze']);
  });

  it('Если можно и купить пойло, и сдать бутылки, планирует купить пойло', () => {
    const homelessTaskFactory = createHomelessTaskFactory({
      drink: () => createStubTask('drink', false),
      buyBooze: () => createStubTask('buy-booze'),
      sellBottles: () => createStubTask('sell-bottles'),
    });

    const names = planNames(
      new HomelessRootTask({ homelessTaskFactory }),
      NpcStateBuilder.default()
    );

    expect(names).toStrictEqual(['buy-booze']);
  });

  it('Если нельзя ни бухать, ни купить пойло, а можно и сдать бутылки, и клянчить, планирует сдать бутылки', () => {
    const homelessTaskFactory = createHomelessTaskFactory({
      drink: () => createStubTask('drink', false),
      buyBooze: () => createStubTask('buy-booze', false),
      sellBottles: () => createStubTask('sell-bottles'),
      beg: () => createStubTask('beg'),
    });

    const names = planNames(
      new HomelessRootTask({ homelessTaskFactory }),
      NpcStateBuilder.default()
    );

    expect(names).toStrictEqual(['sell-bottles']);
  });

  it('Если нельзя ни бухать, ни купить пойло, ни сдать бутылки, планирует клянчить', () => {
    const homelessTaskFactory = createHomelessTaskFactory({
      drink: () => createStubTask('drink', false),
      buyBooze: () => createStubTask('buy-booze', false),
      sellBottles: () => createStubTask('sell-bottles', false),
      beg: () => createStubTask('beg'),
      collectBottles: () => createStubTask('collect-bottles'),
    });

    const names = planNames(
      new HomelessRootTask({ homelessTaskFactory }),
      NpcStateBuilder.default()
    );

    expect(names).toStrictEqual(['beg']);
  });

  it('Если нельзя ни бухать, ни купить пойло, ни сдать бутылки, ни клянчить, планирует собирать бутылки', () => {
    const homelessTaskFactory = createHomelessTaskFactory({
      drink: () => createStubTask('drink', false),
      buyBooze: () => createStubTask('buy-booze', false),
      sellBottles: () => createStubTask('sell-bottles', false),
      beg: () => createStubTask('beg', false),
      collectBottles: () => createStubTask('collect-bottles'),
    });

    const names = planNames(
      new HomelessRootTask({ homelessTaskFactory }),
      NpcStateBuilder.default()
    );

    expect(names).toStrictEqual(['collect-bottles']);
  });

  it('Если нельзя ни бухать, ни купить пойло, ни сдать бутылки, ни клянчить, ни собирать бутылки, план не составляется', () => {
    const homelessTaskFactory = createHomelessTaskFactory({
      drink: () => createStubTask('drink', false),
      buyBooze: () => createStubTask('buy-booze', false),
      sellBottles: () => createStubTask('sell-bottles', false),
      beg: () => createStubTask('beg', false),
      collectBottles: () => createStubTask('collect-bottles', false),
    });

    const names = planNames(
      new HomelessRootTask({ homelessTaskFactory }),
      NpcStateBuilder.default()
    );

    expect(names).toBeNull();
  });
});
