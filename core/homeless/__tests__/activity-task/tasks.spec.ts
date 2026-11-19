import { createStubTask } from '@peetland/htn/dev';
import type { NpcContext, NpcState } from '@peetland/npc';
import { describe, expect, it, vi } from 'vitest';

import { createHomelessTaskFactory } from '../../dev';
import { HomelessActivityTask } from '../../src';

describe('HomelessActivityTask', () => {
  describe('Метод sell-bottles', () => {
    describe('Задачи', () => {
      it('Берёт задачу у homelessTaskFactory.sellBottles', () => {
        const sellBottles = vi.fn(() => createStubTask<NpcState, NpcContext>('sell-bottles'));

        new HomelessActivityTask({
          homelessTaskFactory: createHomelessTaskFactory({ sellBottles }),
        });

        expect(sellBottles).toHaveBeenCalledExactlyOnceWith();
      });
    });
  });

  describe('Метод beg', () => {
    describe('Задачи', () => {
      it('Берёт задачу у homelessTaskFactory.beg', () => {
        const beg = vi.fn(() => createStubTask<NpcState, NpcContext>('beg'));

        new HomelessActivityTask({ homelessTaskFactory: createHomelessTaskFactory({ beg }) });

        expect(beg).toHaveBeenCalledExactlyOnceWith();
      });
    });
  });

  describe('Метод collect-bottles', () => {
    describe('Задачи', () => {
      it('Берёт задачу у homelessTaskFactory.collectBottles', () => {
        const collectBottles = vi.fn(() => createStubTask<NpcState, NpcContext>('collect-bottles'));

        new HomelessActivityTask({
          homelessTaskFactory: createHomelessTaskFactory({ collectBottles }),
        });

        expect(collectBottles).toHaveBeenCalledExactlyOnceWith();
      });
    });
  });
});
