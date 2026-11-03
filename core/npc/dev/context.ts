import type { IActor } from '@peetland/game';
import { Inventory } from '@peetland/inventory';
import { Psyche } from '@peetland/psyche';
import { createPsycheDeps, createPsycheState } from '@peetland/psyche/dev';
import { createActor } from '@peetland/virtual-actor/dev';

import type { NpcContext } from '../src';

/** Создаёт контекст NPC. Если актор не передан, создаётся виртуальный актор. Черты психики не меняют чувства */
export function createNpcContext(actor: IActor = createActor()): NpcContext {
  return {
    actor,
    inventory: new Inventory(),
    psyche: new Psyche(createPsycheState(), createPsycheDeps()),
  };
}
