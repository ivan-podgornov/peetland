import { createStubTask, methodTasks } from '@peetland/htn/dev';
import type { NpcContext, NpcState } from '@peetland/npc';
import { describe, expect, it } from 'vitest';

import { RootTask } from '../../src/root-task';
import type { RootTaskDeps } from '../../src/root-task';

/** Создаёт слои корневой задачи. Значимые для теста слои передаются в deps */
function createLayers(deps: Partial<RootTaskDeps> = {}): RootTaskDeps {
  return {
    needs: createStubTask<NpcState, NpcContext>('needs'),
    addictions: createStubTask<NpcState, NpcContext>('addictions'),
    hobbies: createStubTask<NpcState, NpcContext>('hobbies'),
    activity: createStubTask<NpcState, NpcContext>('activity'),
    ...deps,
  };
}

describe('RootTask', () => {
  describe('Метод needs', () => {
    describe('Задачи', () => {
      it('Состоит из слоя потребностей', () => {
        const needs = createStubTask<NpcState, NpcContext>('needs');

        const task = new RootTask(createLayers({ needs }));

        expect(methodTasks(task, 'needs')).toStrictEqual([needs]);
      });
    });
  });

  describe('Метод addictions', () => {
    describe('Задачи', () => {
      it('Состоит из слоя зависимостей', () => {
        const addictions = createStubTask<NpcState, NpcContext>('addictions');

        const task = new RootTask(createLayers({ addictions }));

        expect(methodTasks(task, 'addictions')).toStrictEqual([addictions]);
      });
    });
  });

  describe('Метод hobbies', () => {
    describe('Задачи', () => {
      it('Состоит из слоя хобби', () => {
        const hobbies = createStubTask<NpcState, NpcContext>('hobbies');

        const task = new RootTask(createLayers({ hobbies }));

        expect(methodTasks(task, 'hobbies')).toStrictEqual([hobbies]);
      });
    });
  });

  describe('Метод activity', () => {
    describe('Задачи', () => {
      it('Состоит из слоя деятельности', () => {
        const activity = createStubTask<NpcState, NpcContext>('activity');

        const task = new RootTask(createLayers({ activity }));

        expect(methodTasks(task, 'activity')).toStrictEqual([activity]);
      });
    });
  });
});
