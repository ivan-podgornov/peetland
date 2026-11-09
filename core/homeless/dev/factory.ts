import { NpcTaskFactory } from '@peetland/npc-tasks';
import { createNpcTaskFactoryDeps } from '@peetland/npc-tasks/dev';
import { createMockedPlaces } from '@peetland/places/dev';
import { createMockedRandom } from '@peetland/random/dev';

import type { IHomelessTaskFactory } from '../src';
import { HomelessTaskFactory } from '../src/factory';
import type { HomelessTaskFactoryDeps } from '../src/factory';

/**
 * Создаёт зависимости фабрики задач бомжа. Примитивы создаёт настоящая фабрика примитивов, удача в
 * зависимостях никогда не выпадает, а время не идёт само
 */
export function createHomelessTaskFactoryDeps(
  deps: Partial<HomelessTaskFactoryDeps> = {}
): HomelessTaskFactoryDeps {
  return {
    npcTaskFactory: new NpcTaskFactory(createNpcTaskFactoryDeps()),
    places: createMockedPlaces(),
    random: createMockedRandom(false),
    ...deps,
  };
}

/**
 * Создаёт фабрику задач бомжа. Методы, которые не переданы, создают настоящие задачи. Значимые для
 * теста методы передаются моками, чтобы проверить, с какими параметрами их вызвали
 */
export function createHomelessTaskFactory(
  factory: Partial<IHomelessTaskFactory> = {}
): IHomelessTaskFactory {
  const real = new HomelessTaskFactory(createHomelessTaskFactoryDeps());

  return {
    purchase: (options) => real.purchase(options),
    buyBooze: () => real.buyBooze(),
    drink: () => real.drink(),
    sellBottles: () => real.sellBottles(),
    collectBottles: () => real.collectBottles(),
    beg: () => real.beg(),
    ...factory,
  };
}
