import { createStubTask } from '@peetland/htn/dev';
import type { NpcContext, NpcState } from '@peetland/npc';
import { describe, expect, it, vi } from 'vitest';

import { createHomelessTaskFactory } from '../../dev';
import { HomelessRootTask } from '../../src';

describe('HomelessRootTask', () => {
  describe('Метод drink', () => {
    describe('Задачи', () => {
      it('Берёт задачу у homelessTaskFactory.drink', () => {
        const drink = vi.fn(() => createStubTask<NpcState, NpcContext>('drink'));

        new HomelessRootTask({ homelessTaskFactory: createHomelessTaskFactory({ drink }) });

        expect(drink).toHaveBeenCalledExactlyOnceWith();
      });
    });
  });

  describe('Метод buy-booze', () => {
    describe('Задачи', () => {
      it('Берёт задачу у homelessTaskFactory.buyBooze', () => {
        const buyBooze = vi.fn(() => createStubTask<NpcState, NpcContext>('buy-booze'));

        new HomelessRootTask({ homelessTaskFactory: createHomelessTaskFactory({ buyBooze }) });

        expect(buyBooze).toHaveBeenCalledExactlyOnceWith();
      });
    });
  });

  describe('Метод sell-bottles', () => {
    describe('Задачи', () => {
      it('Берёт задачу у homelessTaskFactory.sellBottles', () => {
        const sellBottles = vi.fn(() => createStubTask<NpcState, NpcContext>('sell-bottles'));

        new HomelessRootTask({ homelessTaskFactory: createHomelessTaskFactory({ sellBottles }) });

        expect(sellBottles).toHaveBeenCalledExactlyOnceWith();
      });
    });
  });

  describe('Метод beg', () => {
    describe('Задачи', () => {
      it('Берёт задачу у homelessTaskFactory.beg', () => {
        const beg = vi.fn(() => createStubTask<NpcState, NpcContext>('beg'));

        new HomelessRootTask({ homelessTaskFactory: createHomelessTaskFactory({ beg }) });

        expect(beg).toHaveBeenCalledExactlyOnceWith();
      });
    });
  });

  describe('Метод collect-bottles', () => {
    describe('Задачи', () => {
      it('Берёт задачу у homelessTaskFactory.collectBottles', () => {
        const collectBottles = vi.fn(() => createStubTask<NpcState, NpcContext>('collect-bottles'));

        new HomelessRootTask({
          homelessTaskFactory: createHomelessTaskFactory({ collectBottles }),
        });

        expect(collectBottles).toHaveBeenCalledExactlyOnceWith();
      });
    });
  });
});
