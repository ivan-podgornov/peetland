import { Geometry } from '@peetland/geometry';
import type { PrimitiveTask } from '@peetland/htn';
import type { NpcContext, NpcState } from '@peetland/npc';
import { createMockedPsycheFactory } from '@peetland/psyche/dev';
import { createMockedRandom } from '@peetland/random/dev';
import { ManualTimer } from '@peetland/timings';
import { vi } from 'vitest';
import type { Mocked } from 'vitest';

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
    ...factory,
  };
}

/** Создаёт примитивную задачу с названием, которая всегда может выполниться и ничего не меняет */
export function createStubPrimitiveTask(name: string): PrimitiveTask<NpcState, NpcContext> {
  return {
    name,
    canExecute: () => true,
    applyEffects: (state) => state,
    start: () => 'success',
    update: () => 'success',
    stop: vi.fn(),
  };
}

/** Создаёт мок фабрики примитивов. Каждый метод на каждый вызов возвращает новую заглушку задачи */
export function createMockedNpcTaskFactory(): Mocked<INpcTaskFactory> {
  return {
    goToCoords: vi.fn(() => createStubPrimitiveTask('go-to-coords')),
    achieveAngle: vi.fn(() => createStubPrimitiveTask('achieve-angle')),
    playAnimation: vi.fn(() => createStubPrimitiveTask('play-animation')),
    addItem: vi.fn(() => createStubPrimitiveTask('add-item')),
    removeItem: vi.fn(() => createStubPrimitiveTask('remove-item')),
    psycheReact: vi.fn(() => createStubPrimitiveTask('psyche-react')),
    tryLuck: vi.fn(() => createStubPrimitiveTask('try-luck')),
    parallel: vi.fn(() => createStubPrimitiveTask('parallel')),
  };
}
