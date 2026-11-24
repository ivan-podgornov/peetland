import { Memory } from './memory';
import type { IMemory } from './memory';

export interface IMemoryFactory {
  /** Создаёт память, в которую можно запоминать факты (см. Memory) */
  create(): IMemory;
}

/** Фабрика памяти NPC */
export class MemoryFactory implements IMemoryFactory {
  create(): IMemory {
    return new Memory();
  }
}
