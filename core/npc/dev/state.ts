import type { IActor } from '@peetland/game';
import { Inventory } from '@peetland/inventory';
import { Psyche } from '@peetland/psyche';
import { createPsycheDeps, createPsycheState } from '@peetland/psyche/dev';
import { createActor } from '@peetland/virtual-actor/dev';

import type { NpcContext, NpcState } from '../src';

/** Создаёт состояние NPC. Поля, которые не переданы, заполняются незначимыми значениями */
export function createNpcState(state: Partial<NpcState> = {}): NpcState {
  return {
    actor: {
      position: {
        x: 0,
        y: 0,
        z: 0,
      },
      angle: 0,
    },
    inventory: {},
    psyche: createPsycheState(),
    ...state,
  };
}

/** Создаёт контекст NPC. Если актор не передан, создаётся виртуальный актор. Черты психики не меняют чувства */
export function createNpcContext(actor: IActor = createActor()): NpcContext {
  return {
    actor,
    inventory: new Inventory(),
    psyche: new Psyche(createPsycheState(), createPsycheDeps()),
  };
}
