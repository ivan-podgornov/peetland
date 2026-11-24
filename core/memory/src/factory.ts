import type { IReadonlyTime } from '@peetland/timings';

import { Memory } from './memory';
import type { IMemory } from './memory';

export interface IMemoryFactory {
  /**
   * Создаёт память, которая ставит на записях момент игрового времени, когда их запомнили (см.
   * Memory)
   * @param time - время мира
   */
  create(time: IReadonlyTime): IMemory;
}

/** Фабрика памяти NPC */
export class MemoryFactory implements IMemoryFactory {
  create(time: IReadonlyTime): IMemory {
    return new Memory({ time });
  }
}
