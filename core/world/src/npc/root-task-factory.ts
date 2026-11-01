import type { Task } from '@peetland/htn';

import type { IPlaces } from '../places';

import type { NpcContext } from './context';
import type { NpcState } from './state';

export type CreateRootTaskOptions = {
  /** Места мира, которыми пользуется NPC */
  places: IPlaces;
};

/**
 * Создаёт корневые задачи, которые планируют HTN-агенты NPC. NPC объявляет, какая фабрика ему
 * нужна, а реализуют её задачи, поэтому NPC не зависит от задач
 */
export interface IRootTaskFactory {
  /** Создаёт корневую задачу NPC */
  create(options: CreateRootTaskOptions): Task<NpcState, NpcContext>;
}
