import { Geometry } from '@peetland/geometry';
import { createMockedPsycheFactory } from '@peetland/psyche/dev';
import { createMockedRandom } from '@peetland/random/dev';
import { ManualTimer } from '@peetland/timings';
import { vi } from 'vitest';

import { NpcTaskFactory } from '../src';
import type { INpcTaskFactory, NpcTaskFactoryDeps } from '../src';

/** Создаёт зависимости фабрики примитивов. Удача в них никогда не выпадает, а время не идёт само */
export function createNpcTaskFactoryDeps(): NpcTaskFactoryDeps {
  return {
    geometry: new Geometry(),
    psycheFactory: createMockedPsycheFactory(),
    random: createMockedRandom(false),
    timer: new ManualTimer(),
  };
}

/**
 * Создаёт фабрику примитивов. Методы, которые не переданы, создают настоящие задачи. Значимые для
 * теста методы передаются моками, чтобы проверить, с какими параметрами их вызвали
 */
export function createNpcTaskFactory(factory: Partial<INpcTaskFactory> = {}): INpcTaskFactory {
  const real = new NpcTaskFactory(createNpcTaskFactoryDeps());

  return {
    goToCoords: (options) => real.goToCoords(options),
    achieveAngle: (options) => real.achieveAngle(options),
    playAnimation: (options) => real.playAnimation(options),
    addItem: (options) => real.addItem(options),
    removeItem: (options) => real.removeItem(options),
    psycheReact: (options) => real.psycheReact(options),
    tryLuck: (options) => real.tryLuck(options),
    parallel: (options) => real.parallel(options),
    repeat: (times, build) => real.repeat(times, build),
    ...factory,
  };
}

/**
 * Создаёт мок repeat, который собирает цепочку один раз, сколько бы повторений ни попросили. Так
 * тест составной задачи проверяет цепочку и то, сколько повторений просили, не завися от того, как
 * repeat повторяет
 */
export function createMockedRepeat() {
  return vi.fn<INpcTaskFactory['repeat']>((_times, build) => build());
}
