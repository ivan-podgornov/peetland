import { createStubTask, planNames } from '@peetland/htn/dev';
import type { NpcContext, NpcState } from '@peetland/npc';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it, vi } from 'vitest';

import { HomelessRootTask } from '../src';

import { createHomelessTaskFactory } from './helpers';

describe('HomelessRootTask', () => {
  it('Вызывает homelessTaskFactory.drink', () => {
    const drink = vi.fn(() => createStubTask<NpcState, NpcContext>('drink'));

    new HomelessRootTask({ homelessTaskFactory: createHomelessTaskFactory({ drink }) });

    expect(drink).toHaveBeenCalledExactlyOnceWith();
  });

  it('Вызывает homelessTaskFactory.buyBooze', () => {
    const buyBooze = vi.fn(() => createStubTask<NpcState, NpcContext>('buy-booze'));

    new HomelessRootTask({ homelessTaskFactory: createHomelessTaskFactory({ buyBooze }) });

    expect(buyBooze).toHaveBeenCalledExactlyOnceWith();
  });

  it('Вызывает homelessTaskFactory.sellBottles', () => {
    const sellBottles = vi.fn(() => createStubTask<NpcState, NpcContext>('sell-bottles'));

    new HomelessRootTask({ homelessTaskFactory: createHomelessTaskFactory({ sellBottles }) });

    expect(sellBottles).toHaveBeenCalledExactlyOnceWith();
  });

  it('Вызывает homelessTaskFactory.beg', () => {
    const beg = vi.fn(() => createStubTask<NpcState, NpcContext>('beg'));

    new HomelessRootTask({ homelessTaskFactory: createHomelessTaskFactory({ beg }) });

    expect(beg).toHaveBeenCalledExactlyOnceWith();
  });

  it('Вызывает homelessTaskFactory.collectBottles', () => {
    const collectBottles = vi.fn(() => createStubTask<NpcState, NpcContext>('collect-bottles'));

    new HomelessRootTask({ homelessTaskFactory: createHomelessTaskFactory({ collectBottles }) });

    expect(collectBottles).toHaveBeenCalledExactlyOnceWith();
  });

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
