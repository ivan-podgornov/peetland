import type { NpcWorldState } from './state';

/**
 * То, что NPC знает о мире. NPC объявляет, какое знание ему нужно, а реализует его мир, поэтому NPC
 * не зависит от мира
 */
export interface INpcWorldKnowledge {
  /** Возвращает слепок того, что NPC знает о мире сейчас */
  getState(): NpcWorldState;
}
