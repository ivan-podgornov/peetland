import { describe, expect, it, vi } from 'vitest';

import { RootTask } from '../../src';

import {
  createNpcState,
  createPlace,
  createStubTask,
  createTaskFactory,
  planNames,
} from './helpers';

describe('RootTask', () => {
  it('Вызывает taskFactory.drink с местами', () => {
    const drink = vi.fn(() => createStubTask('drink'));
    const places = [createPlace()];

    new RootTask({ places }, { taskFactory: createTaskFactory({ drink }) });

    expect(drink).toHaveBeenCalledExactlyOnceWith({ places });
  });

  it('Вызывает taskFactory.buyBooze с местами', () => {
    const buyBooze = vi.fn(() => createStubTask('buy-booze'));
    const places = [createPlace()];

    new RootTask({ places }, { taskFactory: createTaskFactory({ buyBooze }) });

    expect(buyBooze).toHaveBeenCalledExactlyOnceWith({ places });
  });

  it('Если можно и бухать, и купить пойло, планирует бухать', () => {
    const taskFactory = createTaskFactory({
      drink: () => createStubTask('drink'),
      buyBooze: () => createStubTask('buy-booze'),
    });

    const names = planNames(new RootTask({ places: [] }, { taskFactory }), createNpcState());

    expect(names).toStrictEqual(['drink']);
  });

  it('Если бухать нельзя, планирует купить пойло', () => {
    const taskFactory = createTaskFactory({
      drink: () => createStubTask('drink', false),
      buyBooze: () => createStubTask('buy-booze'),
    });

    const names = planNames(new RootTask({ places: [] }, { taskFactory }), createNpcState());

    expect(names).toStrictEqual(['buy-booze']);
  });

  it('Если нельзя ни бухать, ни купить пойло, план не составляется', () => {
    const taskFactory = createTaskFactory({
      drink: () => createStubTask('drink', false),
      buyBooze: () => createStubTask('buy-booze', false),
    });

    const names = planNames(new RootTask({ places: [] }, { taskFactory }), createNpcState());

    expect(names).toBeNull();
  });
});
