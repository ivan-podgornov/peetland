import type { IActor } from '@peetland/game';
import { Inventory } from '@peetland/inventory';
import { Psyche } from '@peetland/psyche';
import { createPsycheDeps, createPsycheState } from '@peetland/psyche/dev';
import { createActor } from '@peetland/virtual-actor/dev';

import type { NpcContext, NpcSelfState, NpcState, NpcWorldState } from '../src';

export type CreateNpcStateOptions = {
  self?: Partial<NpcSelfState>;
  world?: Partial<NpcWorldState>;
};

/**
 * Создаёт состояние NPC. Поля себя и мира, которые не переданы, заполняются незначимыми
 * значениями: NPC стоит в начале координат с пустым инвентарём, а в мире полночь
 */
export function createNpcState(state: CreateNpcStateOptions = {}): NpcState {
  return {
    self: {
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
      ...state.self,
    },
    world: {
      time: {
        hours: 0,
        minutes: 0,
      },
      ...state.world,
    },
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
