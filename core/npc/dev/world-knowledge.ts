import { ManualTime } from '@peetland/timings';
import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import type { INpcWorldKnowledge, INpcWorldKnowledgeFactory } from '../src';

/**
 * Создаёт знание о мире с переданным состоянием. Если состояние передано не полностью, недостающее
 * заполняется незначимыми значениями: в мире полночь, а видимых NPC нет
 */
export function createMockedNpcWorldKnowledge(
  state: Partial<INpcWorldKnowledge> = {}
): INpcWorldKnowledge {
  return {
    time: new ManualTime(),
    getVisibleNpcs: () => [],
    ...state,
  };
}

/**
 * Создаёт фабрику знания о мире, которая всегда создаёт знание с переданным состоянием. Если
 * состояние передано не полностью, недостающее заполняет createMockedNpcWorldKnowledge
 */
export function createMockedNpcWorldKnowledgeFactory(
  state: Partial<INpcWorldKnowledge> = {}
): Mocked<INpcWorldKnowledgeFactory> {
  return {
    create: vi.fn(() => createMockedNpcWorldKnowledge(state)),
  };
}
