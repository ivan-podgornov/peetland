import { ManualTime } from '@peetland/timings';
import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import type { INpcWorldKnowledge, NpcWorldState } from '../src';

/**
 * Создаёт знание о мире, которое всегда возвращает переданное состояние мира. Если состояние не
 * передано, в мире полночь
 */
export function createMockedNpcWorldKnowledge(
  state: NpcWorldState = {
    time: new ManualTime(),
    getVisibleNpcs: () => [],
  }
): Mocked<INpcWorldKnowledge> {
  return {
    getTime: vi.fn(() => state.time),
    getState: vi.fn(() => state),
    getVisibleNpcs: vi.fn(() => []),
  };
}
