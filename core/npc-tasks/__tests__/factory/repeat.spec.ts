import { createStubPrimitiveTask } from '@peetland/htn/dev';
import type { NpcContext, NpcState } from '@peetland/npc';
import { describe, expect, it, vi } from 'vitest';

import { createNpcTaskFactoryDeps } from '../../dev';
import { NpcTaskFactory } from '../../src';

/** Создаёт build, который на каждое повторение собирает цепочку из двух задач с номером повторения */
function createNumberedBuild() {
  let repetition = 0;

  return vi.fn(() => {
    repetition++;

    return [
      createStubPrimitiveTask<NpcState, NpcContext>(`first-${repetition}`),
      createStubPrimitiveTask<NpcState, NpcContext>(`second-${repetition}`),
    ];
  });
}

describe('NpcTaskFactory', () => {
  describe('#repeat', () => {
    it('Возвращает цепочки, которые собрал build, подряд одним массивом', () => {
      const factory = new NpcTaskFactory(createNpcTaskFactoryDeps());

      const tasks = factory.repeat(2, createNumberedBuild());

      expect(tasks.map((task) => task.name)).toStrictEqual([
        'first-1',
        'second-1',
        'first-2',
        'second-2',
      ]);
    });

    it('Вызывает build на каждое повторение', () => {
      const factory = new NpcTaskFactory(createNpcTaskFactoryDeps());
      const build = createNumberedBuild();

      factory.repeat(3, build);

      expect(build).toHaveBeenCalledTimes(3);
    });

    it('Если times равно 0, возвращает пустой массив и не вызывает build', () => {
      const factory = new NpcTaskFactory(createNpcTaskFactoryDeps());
      const build = createNumberedBuild();

      const tasks = factory.repeat(0, build);

      expect(tasks).toStrictEqual([]);
      expect(build).not.toHaveBeenCalled();
    });

    it('Если times отрицательное, выбрасывает ошибку', () => {
      const factory = new NpcTaskFactory(createNpcTaskFactoryDeps());

      expect(() => factory.repeat(-1, createNumberedBuild())).toThrow();
    });

    it('Если times дробное, выбрасывает ошибку', () => {
      const factory = new NpcTaskFactory(createNpcTaskFactoryDeps());

      expect(() => factory.repeat(1.5, createNumberedBuild())).toThrow();
    });

    it('Если times бесконечное, выбрасывает ошибку', () => {
      const factory = new NpcTaskFactory(createNpcTaskFactoryDeps());

      expect(() => factory.repeat(Infinity, createNumberedBuild())).toThrow();
    });

    it('Если times — NaN, выбрасывает ошибку', () => {
      const factory = new NpcTaskFactory(createNpcTaskFactoryDeps());

      expect(() => factory.repeat(NaN, createNumberedBuild())).toThrow();
    });
  });
});
