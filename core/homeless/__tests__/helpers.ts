import { NpcTaskFactory } from '@peetland/npc-tasks';
import { createNpcTaskFactoryDeps } from '@peetland/npc-tasks/dev';
import { createMockedPlaces } from '@peetland/places/dev';
import { createMockedPsycheFactory } from '@peetland/psyche/dev';
import { createMockedRandom } from '@peetland/random/dev';

import { HomelessTaskFactory } from '../src';
import type { HomelessTaskFactoryDeps, IHomelessTaskFactory } from '../src';

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
    psycheFactory: createMockedPsycheFactory(),
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
