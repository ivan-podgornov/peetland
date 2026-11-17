import type { CompoundTask, Method } from '@peetland/htn';
import type { NpcContext, NpcState } from '@peetland/npc';

/**
 * Утолить голод: восполнить сытость. Методы — способы поесть, одинаковые для всех типов NPC. Если
 * способ доступен не всем, это решают его предусловия, например по типу NPC. Пока способов нет,
 * поэтому методов нет, и утолить голод нечем
 */
export class SatisfyHungerTask implements CompoundTask<NpcState, NpcContext> {
  readonly name = 'satisfy-hunger';

  readonly methods: Method<NpcState, NpcContext>[] = [];
}
