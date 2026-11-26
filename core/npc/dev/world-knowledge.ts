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
 * Создаёт фабрику знания о мире, которая всегда создаёт переданное знание. Если знание не
 * передано, фабрика создаёт знание по умолчанию: полночь и пустой список видимых NPC
 */
export function createMockedNpcWorldKnowledgeFactory(
  state: INpcWorldKnowledge = createMockedNpcWorldKnowledge()
): Mocked<INpcWorldKnowledgeFactory> {
  return {
    time: state.time,
    create: vi.fn(() => state),
  };
}
