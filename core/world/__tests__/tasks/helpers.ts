import { NpcTaskFactory } from '@peetland/npc-tasks';
import { createNpcTaskFactory, createNpcTaskFactoryDeps } from '@peetland/npc-tasks/dev';
import { createMockedPsycheFactory } from '@peetland/psyche/dev';
import { createMockedRandom } from '@peetland/random/dev';

import { TaskFactory } from '../../src';
import type { ITaskFactory, TaskFactoryDeps } from '../../src';

export { createNpcContext, createNpcState } from '@peetland/npc/dev';
export { applyPlanEffects, createStubTask, plan, planNames } from '@peetland/npc-tasks/dev';
export { createPlace } from '@peetland/places/dev';

/**
 * Создаёт зависимости фабрики задач. Примитивы создаёт настоящая фабрика примитивов, удача в
 * зависимостях никогда не выпадает, а время не идёт само
 */
export function createTaskFactoryDeps(deps: Partial<TaskFactoryDeps> = {}): TaskFactoryDeps {
  return {
    npcTaskFactory: new NpcTaskFactory(createNpcTaskFactoryDeps()),
    psycheFactory: createMockedPsycheFactory(),
    random: createMockedRandom(false),
    ...deps,
  };
}

/**
 * Создаёт фабрику задач. Методы, которые не переданы, создают настоящие задачи. Значимые для теста
 * методы передаются моками, чтобы проверить, с какими параметрами их вызвали
 */
export function createTaskFactory(factory: Partial<ITaskFactory> = {}): ITaskFactory {
  const real = new TaskFactory(createTaskFactoryDeps());

  return {
    ...createNpcTaskFactory(),
    purchase: (options) => real.purchase(options),
    buyBooze: (options) => real.buyBooze(options),
    drink: (options) => real.drink(options),
    sellBottles: (options) => real.sellBottles(options),
    collectBottles: (options) => real.collectBottles(options),
    beg: (options) => real.beg(options),
    ...factory,
  };
}
