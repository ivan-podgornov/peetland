import { createStubTask } from '@peetland/htn/dev';
import type { NpcContext, NpcState } from '@peetland/npc';
import { describe, expect, it, vi } from 'vitest';

import { createHomelessTaskFactory } from '../../dev';
import { HomelessRootTask } from '../../src';

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
});
