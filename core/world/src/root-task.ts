import type { CompoundTask, Method, Task } from '@peetland/htn';
import type { NpcContext, NpcState } from '@peetland/npc';

export type RootTaskDeps = {
  /** Слой потребностей: то, без чего NPC не может жить */
  needs: Task<NpcState, NpcContext>;
  /** Слой зависимостей: то, без чего NPC жить не хочет */
  addictions: Task<NpcState, NpcContext>;
  /** Слой деятельности: то, чем NPC занят по своему типу */
  activity: Task<NpcState, NpcContext>;
  /** Слой хобби: то, чем NPC занимается для души */
  hobbies: Task<NpcState, NpcContext>;
};

/**
 * Корневая задача NPC: жить. Методы — слои, перечисленные по приоритету: потребности, а если
 * планировать нечего — зависимости, а если и их нечего — деятельность, а иначе — хобби. Когда
 * слою есть что планировать, решают предусловия его задач: например, деятельность ограничена своим
 * расписанием, а хобби занимает свободное от неё время
 */
export class RootTask implements CompoundTask<NpcState, NpcContext> {
  readonly name = 'live';

  readonly methods: Method<NpcState, NpcContext>[];

  constructor(deps: RootTaskDeps) {
    const { needs, addictions, activity, hobbies } = deps;

    this.methods = [
      {
        name: 'needs',
        preconditions: () => true,
        tasks: [needs],
      },
      {
        name: 'addictions',
        preconditions: () => true,
        tasks: [addictions],
      },
      {
        name: 'activity',
        preconditions: () => true,
        tasks: [activity],
      },
      {
        name: 'hobbies',
        preconditions: () => true,
        tasks: [hobbies],
      },
    ];
  }
}
