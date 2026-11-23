import type { IAbortSignal } from '@peetland/events';
import type { IActor } from '@peetland/game';
import type { IActorNpcRegistry, Npc } from '@peetland/npc';

/** Реестр связей «актор ↔ NPC»: две мапы, перевод в обе стороны за O(1) */
export class ActorNpcRegistry implements IActorNpcRegistry {
  private readonly npcToActor = new Map<Npc, IActor>();
  private readonly actorToNpc = new Map<IActor, Npc>();

  register(actor: IActor, npc: Npc, signal: IAbortSignal): void {
    this.npcToActor.set(npc, actor);
    this.actorToNpc.set(actor, npc);

    signal.addEventListener(
      'abort',
      () => {
        this.npcToActor.delete(npc);
        this.actorToNpc.delete(actor);
      },
      { once: true }
    );
  }

  getActor(npc: Npc): IActor | undefined {
    return this.npcToActor.get(npc);
  }

  getNpc(actor: IActor): Npc | undefined {
    return this.actorToNpc.get(actor);
  }
}
