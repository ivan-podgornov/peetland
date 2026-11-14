import { Geometry } from '@peetland/geometry';
import type { PrimitiveTask } from '@peetland/htn';
import { createStubPrimitiveTask } from '@peetland/htn/dev';
import type { NpcContext, NpcState } from '@peetland/npc';
import { createMockedRandom } from '@peetland/random/dev';
import { ManualTimer } from '@peetland/timings';

import { NpcTaskFactory } from '../src';
import type { INpcTaskFactory, NpcTaskFactoryDeps } from '../src';

/** Создаёт зависимости фабрики примитивов. Удача в них никогда не выпадает, а время не идёт само */
export function createNpcTaskFactoryDeps(): NpcTaskFactoryDeps {
  return {
    geometry: new Geometry(),
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
    ...factory,
  };
}

/**
 * Создаёт примитивную задачу NPC с названием, которая всегда может выполниться и ничего не меняет.
 * Её возвращают моки методов фабрики примитивов, когда тесту важны только параметры вызова
 */
export function createStubNpcTask(name: string): PrimitiveTask<NpcState, NpcContext> {
  return createStubPrimitiveTask<NpcState, NpcContext>(name);
}
