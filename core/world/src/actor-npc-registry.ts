import type { IActor } from '@peetland/game';
import type { IActorNpcRegistry, INpc } from '@peetland/npc';

/** Реестр связей «актор ↔ NPC»: две мапы, перевод в обе стороны за O(1) */
export class ActorNpcRegistry implements IActorNpcRegistry {
  private readonly npcToActor = new Map<INpc, IActor>();
  private readonly actorToNpc = new Map<IActor, INpc>();

  register(actor: IActor, npc: INpc): void {
    this.npcToActor.set(npc, actor);
    this.actorToNpc.set(actor, npc);

    npc.signal.addEventListener(
      'abort',
      () => {
        this.npcToActor.delete(npc);
        this.actorToNpc.delete(actor);
      },
      { once: true }
    );
  }

  getActor(npc: INpc): IActor | undefined {
    return this.npcToActor.get(npc);
  }

  getNpc(actor: IActor): INpc | undefined {
    return this.actorToNpc.get(actor);
  }
}
