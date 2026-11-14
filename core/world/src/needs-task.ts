import type { CompoundTask, Method } from '@peetland/htn';
import { NEED_DEFINITIONS, NEED_PRIORITY, NeedCategory } from '@peetland/needs';
import type { ISatisfyNeedTaskFactory } from '@peetland/needs-tasks';
import type { NpcContext, NpcState } from '@peetland/npc';

export type NeedsTaskDeps = {
  /** Фабрика задач, которые удовлетворяют потребности */
  satisfyNeedTaskFactory: ISatisfyNeedTaskFactory;
};

/**
 * Слой потребностей корневой задачи NPC: то, без чего NPC не может жить. Методы — жизненные
 * потребности в порядке NEED_PRIORITY. Метод подходит, если его потребность срочная, и планирует её
 * удовлетворение. Если удовлетворить её нечем, планировщик переходит к следующей срочной, а если
 * срочных нет, — к следующему слою
 */
export class NeedsTask implements CompoundTask<NpcState, NpcContext> {
  readonly name = 'needs';

  readonly methods: Method<NpcState, NpcContext>[];

  constructor(deps: NeedsTaskDeps) {
    const { satisfyNeedTaskFactory } = deps;

    this.methods = NEED_PRIORITY.filter(
      (need) => NEED_DEFINITIONS[need].category === NeedCategory.Vital
    ).map<Method<NpcState, NpcContext>>((need) => ({
      name: need,
      preconditions: (state) => state.self.needs.isUrgent(need, state.world.time),
      tasks: [satisfyNeedTaskFactory.create(need)],
    }));
  }
}
