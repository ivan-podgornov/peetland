import { Addictions } from '@peetland/addictions';
import { createAddictionsDeps, createAddictionsState } from '@peetland/addictions/dev';
import type { IActor } from '@peetland/game';
import { Inventory } from '@peetland/inventory';
import { Memory } from '@peetland/memory';
import { Needs } from '@peetland/needs';
import { createNeedsDeps, createNeedsState } from '@peetland/needs/dev';
import { Psyche } from '@peetland/psyche';
import { createPsycheDeps, createPsycheState } from '@peetland/psyche/dev';
import { ManualTime } from '@peetland/timings';
import { createActor } from '@peetland/virtual-actor/dev';

import type { NpcContext } from '../src';

/**
 * Создаёт контекст NPC. Если актор не передан, создаётся виртуальный актор. Черты психики не меняют
 * чувства и модификаторы, потребности удовлетворены полностью, а зависимостей нет
 */
export function createNpcContext(actor: IActor = createActor()): NpcContext {
  return {
    actor,
    inventory: new Inventory(),
    psyche: new Psyche(createPsycheState(), createPsycheDeps()),
    needs: new Needs(createNeedsState(), createNeedsDeps()),
    addictions: new Addictions(createAddictionsState(), createAddictionsDeps()),
    memory: new Memory({ time: new ManualTime() }),
  };
}
