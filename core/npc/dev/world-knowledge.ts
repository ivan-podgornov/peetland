import { ManualTime } from '@peetland/timings';
import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import type { INpcWorldKnowledge, INpcWorldKnowledgeFactory } from '../src';

/**
 * Создаёт фабрику знания о мире, которая всегда создаёт знание с переданным состоянием. Если
 * состояние не передано, в мире полночь
 */
export function createMockedNpcWorldKnowledgeFactory(
  state: INpcWorldKnowledge = {
    time: new ManualTime(),
    getVisibleNpcs: () => [],
  }
): Mocked<INpcWorldKnowledgeFactory> {
  return {
    time: state.time,
    create: vi.fn(() => state),
  };
}
