import { AbortController } from '@peetland/events';
import type { Observable } from '@peetland/events';
import type { IActor, IActorFactory } from '@peetland/game';
import type { IHTN, IHTNFactory } from '@peetland/htn';
import type { IInventoryFactory, Inventory } from '@peetland/inventory';
import type { IPsyche, IPsycheFactory } from '@peetland/psyche';

import type { IPlaces } from '../places';

import type { NpcContext } from './context';
import type { NpcData } from './data';
import type { IRootTaskFactory } from './root-task-factory';
import type { NpcState } from './state';

export type NpcDeps = {
  /** Фабрика, которой NPC создаёт своего актора */
  actorFactory: IActorFactory;
  /** Фабрика, которой NPC создаёт своего HTN-агента. Агент сам планирует и перепланирует задачи */
  htnFactory: IHTNFactory<NpcState, NpcContext>;
  /** Фабрика, которой NPC создаёт свой инвентарь */
  inventoryFactory: IInventoryFactory;
  /** Фабрика, которой NPC создаёт свою психику */
  psycheFactory: IPsycheFactory;
  /** Фабрика, которой NPC создаёт корневую задачу своего HTN-агента */
  rootTaskFactory: IRootTaskFactory;
  /** Места мира, которыми пользуется NPC */
  places: IPlaces;
  /** Сообщает о каждом кадре игры */
  frames: Observable<unknown>;
};

/** NPC склеивает свои данные, актора и HTN-агента */
export class Npc {
  readonly id: string;
  readonly inventory: Inventory;
  readonly psyche: IPsyche;

  private readonly actor: IActor;
  private readonly context: NpcContext;
  private readonly htn: IHTN<NpcState, NpcContext>;
  private readonly lifetime: AbortController;

  /**
   * Создаёт актора, инвентарь, психику и HTN-агента по данным NPC и каждый кадр передаёт агенту актуальное состояние и
   * контекст с актором, инвентарём и психикой
   * @param data - данные NPC
   */
  constructor(data: NpcData, deps: NpcDeps) {
    const {
      actorFactory,
      frames,
      htnFactory,
      inventoryFactory,
      places,
      psycheFactory,
      rootTaskFactory,
    } = deps;

    this.id = data.id;
    this.inventory = inventoryFactory.create(data.inventory);
    this.psyche = psycheFactory.create(data.psyche);
    this.lifetime = new AbortController();
    this.actor = actorFactory.create({
      modelId: data.modelId,
      position: data.spawnPosition,
      angle: data.spawnAngle,
    });
    this.context = { actor: this.actor, inventory: this.inventory, psyche: this.psyche };
    this.htn = htnFactory.create(rootTaskFactory.create({ places }));

    frames.subscribe(() => this.htn.update(this.getState(), this.context), {
      signal: this.lifetime.signal,
    });
  }

  /** Возвращает состояние NPC со слепками актора, инвентаря и психики (см. NpcState) */
  getState(): NpcState {
    return {
      actor: { position: this.actor.getPosition(), angle: this.actor.getAngle() },
      inventory: this.inventory.getAll(),
      psyche: this.psyche.getState(),
    };
  }

  /**
   * Завершает жизнь NPC: перестаёт следить за кадрами, останавливает HTN-агента и деспавнит
   * актора. После деспавна NPC больше не пользуются
   */
  despawn(): void {
    this.lifetime.abort();
    this.htn.stop(this.context);
    this.actor.despawn();
  }
}
