import { createStubTask, planNames } from '@peetland/htn/dev';
import type { NpcContext, NpcState } from '@peetland/npc';
import { createNpcState } from '@peetland/npc/dev';
import { createMockedPlaces } from '@peetland/places/dev';
import { describe, expect, it, vi } from 'vitest';

import { HomelessRootTask } from '../src';

import { createHomelessTaskFactory } from './helpers';

describe('HomelessRootTask', () => {
  it('Вызывает homelessTaskFactory.drink с местами', () => {
    const drink = vi.fn(() => createStubTask<NpcState, NpcContext>('drink'));
    const places = createMockedPlaces();

    new HomelessRootTask({ places }, { homelessTaskFactory: createHomelessTaskFactory({ drink }) });

    expect(drink).toHaveBeenCalledExactlyOnceWith({ places });
  });

  it('Вызывает homelessTaskFactory.buyBooze с местами', () => {
    const buyBooze = vi.fn(() => createStubTask<NpcState, NpcContext>('buy-booze'));
    const places = createMockedPlaces();

    new HomelessRootTask(
      { places },
      { homelessTaskFactory: createHomelessTaskFactory({ buyBooze }) }
    );

    expect(buyBooze).toHaveBeenCalledExactlyOnceWith({ places });
  });

  it('Вызывает homelessTaskFactory.sellBottles с местами', () => {
    const sellBottles = vi.fn(() => createStubTask<NpcState, NpcContext>('sell-bottles'));
    const places = createMockedPlaces();

    new HomelessRootTask(
      { places },
      { homelessTaskFactory: createHomelessTaskFactory({ sellBottles }) }
    );

    expect(sellBottles).toHaveBeenCalledExactlyOnceWith({ places });
  });

  it('Вызывает homelessTaskFactory.beg с местами', () => {
    const beg = vi.fn(() => createStubTask<NpcState, NpcContext>('beg'));
    const places = createMockedPlaces();

    new HomelessRootTask({ places }, { homelessTaskFactory: createHomelessTaskFactory({ beg }) });

    expect(beg).toHaveBeenCalledExactlyOnceWith({ places });
  });

  it('Вызывает homelessTaskFactory.collectBottles с местами', () => {
    const collectBottles = vi.fn(() => createStubTask<NpcState, NpcContext>('collect-bottles'));
    const places = createMockedPlaces();

    new HomelessRootTask(
      { places },
      { homelessTaskFactory: createHomelessTaskFactory({ collectBottles }) }
    );

    expect(collectBottles).toHaveBeenCalledExactlyOnceWith({ places });
  });

  it('Если можно и бухать, и купить пойло, планирует бухать', () => {
    const homelessTaskFactory = createHomelessTaskFactory({
      drink: () => createStubTask('drink'),
      buyBooze: () => createStubTask('buy-booze'),
    });

    const names = planNames(
      new HomelessRootTask({ places: createMockedPlaces() }, { homelessTaskFactory }),
      createNpcState()
    );

    expect(names).toStrictEqual(['drink']);
  });

  it('Если бухать нельзя, планирует купить пойло', () => {
    const homelessTaskFactory = createHomelessTaskFactory({
      drink: () => createStubTask('drink', false),
      buyBooze: () => createStubTask('buy-booze'),
    });

    const names = planNames(
      new HomelessRootTask({ places: createMockedPlaces() }, { homelessTaskFactory }),
      createNpcState()
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
      new HomelessRootTask({ places: createMockedPlaces() }, { homelessTaskFactory }),
      createNpcState()
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
      new HomelessRootTask({ places: createMockedPlaces() }, { homelessTaskFactory }),
      createNpcState()
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
      new HomelessRootTask({ places: createMockedPlaces() }, { homelessTaskFactory }),
      createNpcState()
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
      new HomelessRootTask({ places: createMockedPlaces() }, { homelessTaskFactory }),
      createNpcState()
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
      new HomelessRootTask({ places: createMockedPlaces() }, { homelessTaskFactory }),
      createNpcState()
    );

    expect(names).toBeNull();
  });
});
