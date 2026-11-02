import type { IGeometry } from '@peetland/geometry';
import { HomelessRootTaskFactory } from '@peetland/homeless';
import type { Task } from '@peetland/htn';
import { NpcKind } from '@peetland/npc';
import type { IKindRootTaskFactory, IRootTaskFactory, NpcContext, NpcState } from '@peetland/npc';
import type { IPlaces } from '@peetland/places';
import type { IPsycheFactory } from '@peetland/psyche';
import type { IRandom } from '@peetland/random';
import type { ITimer } from '@peetland/timings';

/** Фабрика корневой задачи для каждого типа NPC */
export type KindRootTaskFactories = Readonly<Record<NpcKind, IKindRootTaskFactory>>;

export type RootTaskFactoryDeps = {
  geometry: IGeometry;
  /** Места мира, которые получают задачи NPC */
  places: IPlaces;
  /** Фабрика, которой задачи собирают психику из слепка, чтобы предсказать её реакцию в эффектах */
  psycheFactory: IPsycheFactory;
  random: IRandom;
  timer: ITimer;
  /**
   * Фабрики корневых задач, которые заменяют фабрики по умолчанию. По умолчанию у каждого типа NPC
   * фабрика из его пакета с задачами
   */
  kindFactories?: Partial<KindRootTaskFactories>;
};

/** Создаёт корневую задачу NPC фабрикой его типа */
export class RootTaskFactory implements IRootTaskFactory {
  private readonly kindFactories: KindRootTaskFactories;

  constructor(deps: RootTaskFactoryDeps) {
    const { kindFactories = {}, ...shared } = deps;

    this.kindFactories = {
      [NpcKind.Homeless]: kindFactories[NpcKind.Homeless] ?? new HomelessRootTaskFactory(shared),
    };
  }

  create(kind: NpcKind): Task<NpcState, NpcContext> {
    const { kindFactories } = this;

    return kindFactories[kind].create();
  }
}
