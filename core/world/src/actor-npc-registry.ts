import type { IActor } from '@peetland/game';
import type { IActorNpcRegistry, INpc } from '@peetland/npc';

/** Реестр связей «актор ↔ NPC»: тело ↔ личность */
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

  getActor(npc: INpc): IActor {
    const actor = this.npcToActor.get(npc);

    if (!actor) {
      throw new Error('NPC не в реестре');
    }

    return actor;
  }

  getNpc(actor: IActor): INpc {
    const npc = this.actorToNpc.get(actor);

    if (!npc) {
      throw new Error('У актора нет NPC в реестре');
    }

    return npc;
  }
}
