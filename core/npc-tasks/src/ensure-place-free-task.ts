import type { IGeometry, Vector3 } from '@peetland/geometry';
import type { PrimitiveTask, TaskResult } from '@peetland/htn';
import type { NpcContext, NpcState } from '@peetland/npc';

export type EnsurePlaceFreeTaskOptions = {
  /** Идентификатор места, свободу которого проверяет задача */
  placeId: string;
  /** Позиция места, свободу которого проверяет задача */
  position: Vector3;
};

export type EnsurePlaceFreeTaskDeps = {
  geometry: IGeometry;
};

/**
 * Убедиться, что место свободно: перед занятием места NPC смотрит, нет ли у места видимого NPC в
 * радиусе занятости. Место занято — задача запоминает факт `placeTaken` и завершается неудачей,
 * чтобы HTN перепланировал. Проверка только визуальная: невидимого соседа NPC не «чувствует». Задача
 * мгновенная: завершается прямо в start
 */
export class EnsurePlaceFreeTask implements PrimitiveTask<NpcState, NpcContext> {
  /** На каком расстоянии от места NPC считается занявшим место, в метрах */
  static readonly OCCUPANCY_RADIUS = 2;

  readonly name = 'ensure-place-free';

  private readonly options: EnsurePlaceFreeTaskOptions;
  private readonly deps: EnsurePlaceFreeTaskDeps;

  constructor(options: EnsurePlaceFreeTaskOptions, deps: EnsurePlaceFreeTaskDeps) {
    this.options = options;
    this.deps = deps;
  }

  canExecute(): boolean {
    return true;
  }

  /** Проверка состояния не меняет: занятое место задача занимает не эффектом, а неудачей */
  applyEffects(state: NpcState): NpcState {
    return state;
  }

  /** Запоминает `placeTaken` и возвращает 'failed', если у места стоит видимый NPC */
  start(state: NpcState, context: NpcContext): TaskResult {
    const { geometry } = this.deps;
    const { placeId, position } = this.options;
    const distance = geometry.getDistance3d(state.self.actor.position, position);
    const visibleNpcs = state.world.getVisibleNpcs(distance + EnsurePlaceFreeTask.OCCUPANCY_RADIUS);
    const taken = visibleNpcs.some(
      (npc) =>
        geometry.getDistance3d(npc.getState().self.actor.position, position) <=
        EnsurePlaceFreeTask.OCCUPANCY_RADIUS
    );

    if (!taken) {
      return 'success';
    }

    context.memory.remember({
      type: 'placeTaken',
      details: { placeId },
      rememberedAt: state.world.time.getState(),
    });

    return 'failed';
  }

  /** Задача завершается в start, поэтому, если до update всё же дошло, возвращает 'failed' */
  update(): TaskResult {
    return 'failed';
  }

  /** Задача мгновенная, останавливать нечего */
  stop(): void {}
}
