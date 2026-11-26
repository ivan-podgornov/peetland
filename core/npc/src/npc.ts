import type { IAddictions } from '@peetland/addictions';
import { AbortController } from '@peetland/events';
import type { IAbortSignal } from '@peetland/events';
import type { IActor } from '@peetland/game';
import type { IHTN } from '@peetland/htn';
import type { Inventory } from '@peetland/inventory';
import type { IMemory } from '@peetland/memory';
import type { INeeds, IUrgencyWatcher } from '@peetland/needs';
import type { IPsyche } from '@peetland/psyche';

import type { NpcContext } from './context';
import type { NpcData } from './data';
import type { NpcKind } from './kind';
import type { INpc, INpcWorldKnowledge, NpcDeps, NpcState } from './types';

/** NPC — личность, которая живёт в теле-акторе */
export class Npc implements INpc {
  readonly id: string;
  readonly kind: NpcKind;

  private readonly addictions: IAddictions;
  private readonly actor: IActor;
  private readonly context: NpcContext;
  private readonly htn: IHTN<NpcState, NpcContext>;
  private readonly inventory: Inventory;
  private readonly lifetime: AbortController;
  private readonly memory: IMemory;
  private readonly needs: INeeds;
  private readonly psyche: IPsyche;
  private readonly urgencyWatcher: IUrgencyWatcher;
  private readonly worldKnowledge: INpcWorldKnowledge;

  /**
   * Каждый тик передаёт HTN-агенту актуальное состояние и контекст. Когда игра завершается,
   * деспавнится, а если она уже завершилась, деспавнится сразу
   * @param data - данные NPC
   * @param deps - готовые сущности и сервисы, с которыми NPC живёт
   */
  constructor(data: NpcData, deps: NpcDeps) {
    const {
      actor,
      actorNpcRegistry,
      htn,
      inventory,
      psyche,
      needs,
      addictions,
      memory,
      urgencyWatcher,
      ticks,
      worldKnowledge,
      gameSignal,
    } = deps;

    this.id = data.id;
    this.kind = data.kind;
    this.actor = actor;
    this.inventory = inventory;
    this.psyche = psyche;
    this.needs = needs;
    this.addictions = addictions;
    this.memory = memory;
    this.urgencyWatcher = urgencyWatcher;
    this.worldKnowledge = worldKnowledge;
    this.lifetime = new AbortController();
    actorNpcRegistry.register(actor, this);
    this.context = {
      actor,
      inventory,
      psyche,
      needs,
      addictions,
      memory,
    };
    this.htn = htn;

    ticks.subscribe(() => this.tick(), { signal: this.lifetime.signal });

    if (gameSignal.aborted) {
      this.despawn();
      return;
    }

    gameSignal.addEventListener('abort', () => this.despawn(), {
      once: true,
      signal: this.lifetime.signal,
    });
  }

  get signal(): IAbortSignal {
    return this.lifetime.signal;
  }

  /** Возвращает состояние NPC: слепок самого NPC и то, что он знает о мире (см. NpcState) */
  getState(): NpcState {
    return {
      self: {
        kind: this.kind,
        actor: {
          position: this.actor.getPosition(),
          angle: this.actor.getAngle(),
        },
        inventory: this.inventory,
        psyche: this.psyche,
        needs: this.needs,
        addictions: this.addictions,
        memory: this.memory,
      },
      world: this.worldKnowledge,
    };
  }

  /**
   * Продвигает HTN-агента на тик. Если потребность только что стала срочной, сначала мягко
   * останавливает текущий план: так агент доделает транзакции и перепланирует, и слой потребностей
   * успеет её удовлетворить
   */
  private tick(): void {
    const state = this.getState();

    if (this.urgencyWatcher.check(state.self.needs, state.world.time)) {
      this.htn.softStop();
    }

    this.htn.update(state, this.context);
  }

  /**
   * Завершает жизнь NPC: перестаёт следить за тиками, останавливает HTN-агента и деспавнит
   * актора. После деспавна NPC больше не пользуются
   */
  despawn(): void {
    this.lifetime.abort();
    this.htn.stop(this.context);
    this.actor.despawn();
  }
}
