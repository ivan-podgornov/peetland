import { describe, expect, it, vi } from 'vitest';

import { RootTask } from '../../src';
import { createMockedPlaces } from '../places/helpers';

import { createNpcState, createStubTask, createTaskFactory, planNames } from './helpers';

describe('RootTask', () => {
  it('Вызывает taskFactory.drink с местами', () => {
    const drink = vi.fn(() => createStubTask('drink'));
    const places = createMockedPlaces();

    new RootTask({ places }, { taskFactory: createTaskFactory({ drink }) });

    expect(drink).toHaveBeenCalledExactlyOnceWith({ places });
  });

  it('Вызывает taskFactory.buyBooze с местами', () => {
    const buyBooze = vi.fn(() => createStubTask('buy-booze'));
    const places = createMockedPlaces();

    new RootTask({ places }, { taskFactory: createTaskFactory({ buyBooze }) });

    expect(buyBooze).toHaveBeenCalledExactlyOnceWith({ places });
  });

  it('Вызывает taskFactory.sellBottles с местами', () => {
    const sellBottles = vi.fn(() => createStubTask('sell-bottles'));
    const places = createMockedPlaces();

    new RootTask({ places }, { taskFactory: createTaskFactory({ sellBottles }) });

    expect(sellBottles).toHaveBeenCalledExactlyOnceWith({ places });
  });

  it('Вызывает taskFactory.collectBottles с местами', () => {
    const collectBottles = vi.fn(() => createStubTask('collect-bottles'));
    const places = createMockedPlaces();

    new RootTask({ places }, { taskFactory: createTaskFactory({ collectBottles }) });

    expect(collectBottles).toHaveBeenCalledExactlyOnceWith({ places });
  });

  it('Если можно и бухать, и купить пойло, планирует бухать', () => {
    const taskFactory = createTaskFactory({
      drink: () => createStubTask('drink'),
      buyBooze: () => createStubTask('buy-booze'),
    });

    const names = planNames(
      new RootTask({ places: createMockedPlaces() }, { taskFactory }),
      createNpcState()
    );

    expect(names).toStrictEqual(['drink']);
  });

  it('Если бухать нельзя, планирует купить пойло', () => {
    const taskFactory = createTaskFactory({
      drink: () => createStubTask('drink', false),
      buyBooze: () => createStubTask('buy-booze'),
    });

    const names = planNames(
      new RootTask({ places: createMockedPlaces() }, { taskFactory }),
      createNpcState()
    );

    expect(names).toStrictEqual(['buy-booze']);
  });

  it('Если можно и купить пойло, и сдать бутылки, планирует купить пойло', () => {
    const taskFactory = createTaskFactory({
      drink: () => createStubTask('drink', false),
      buyBooze: () => createStubTask('buy-booze'),
      sellBottles: () => createStubTask('sell-bottles'),
    });

    const names = planNames(
      new RootTask({ places: createMockedPlaces() }, { taskFactory }),
      createNpcState()
    );

    expect(names).toStrictEqual(['buy-booze']);
  });

  it('Если нельзя ни бухать, ни купить пойло, планирует сдать бутылки', () => {
    const taskFactory = createTaskFactory({
      drink: () => createStubTask('drink', false),
      buyBooze: () => createStubTask('buy-booze', false),
      sellBottles: () => createStubTask('sell-bottles'),
      collectBottles: () => createStubTask('collect-bottles'),
    });

    const names = planNames(
      new RootTask({ places: createMockedPlaces() }, { taskFactory }),
      createNpcState()
    );

    expect(names).toStrictEqual(['sell-bottles']);
  });

  it('Если нельзя ни бухать, ни купить пойло, ни сдать бутылки, планирует собирать бутылки', () => {
    const taskFactory = createTaskFactory({
      drink: () => createStubTask('drink', false),
      buyBooze: () => createStubTask('buy-booze', false),
      sellBottles: () => createStubTask('sell-bottles', false),
      collectBottles: () => createStubTask('collect-bottles'),
    });

    const names = planNames(
      new RootTask({ places: createMockedPlaces() }, { taskFactory }),
      createNpcState()
    );

    expect(names).toStrictEqual(['collect-bottles']);
  });

  it('Если нельзя ни бухать, ни купить пойло, ни сдать, ни собирать бутылки, план не составляется', () => {
    const taskFactory = createTaskFactory({
      drink: () => createStubTask('drink', false),
      buyBooze: () => createStubTask('buy-booze', false),
      sellBottles: () => createStubTask('sell-bottles', false),
      collectBottles: () => createStubTask('collect-bottles', false),
    });

    const names = planNames(
      new RootTask({ places: createMockedPlaces() }, { taskFactory }),
      createNpcState()
    );

    expect(names).toBeNull();
  });
});
