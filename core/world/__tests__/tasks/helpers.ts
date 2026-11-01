import { Observable } from '@peetland/events';
import { createControlledObservable } from '@peetland/events/dev';
import type { IActor, IActorCommand } from '@peetland/game';
import { Geometry } from '@peetland/geometry';
import { Planner } from '@peetland/htn';
import type { PrimitiveTask, Task } from '@peetland/htn';
import { Inventory } from '@peetland/inventory';
import { createActor } from '@peetland/virtual-actor/dev';
import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import { PlaceType, TaskFactory } from '../../src';
import type { ITaskFactory } from '../../src';
import type { NpcContext, NpcState, PlaceData } from '../../src';
import { CommandTask } from '../../src/tasks/command-task';

/** Создаёт состояние NPC. Поля, которые не переданы, заполняются незначимыми значениями */
export function createNpcState(state: Partial<NpcState> = {}): NpcState {
  return {
    actor: { position: { x: 0, y: 0, z: 0 }, angle: 0 },
    inventory: {},
    traits: { conscientiousness: 50 },
    feelings: { shame: 0 },
    ...state,
  };
}

/** Создаёт контекст NPC. Если актор не передан, создаётся виртуальный актор */
export function createNpcContext(actor: IActor = createActor()): NpcContext {
  return { actor, inventory: new Inventory() };
}

/** Создаёт команду, завершением которой управляет тест */
export function createControlledCommand() {
  const { observable, subscriber } = createControlledObservable();
  const command: Mocked<IActorCommand> = {
    name: 'controlled',
    execute: vi.fn(() => observable),
    cancel: vi.fn((reason: unknown) => subscriber.error(reason)),
  };

  return { command, subscriber };
}

/** Создаёт команду, Observable которой завершается сразу при подписке */
export function createImmediateCommand(finish: 'complete' | 'error'): IActorCommand {
  return {
    name: 'immediate',
    execute: () =>
      new Observable((subscriber) => {
        if (finish === 'complete') {
          subscriber.complete();
        } else {
          subscriber.error(new Error('Не выполнена'));
        }
      }),
    cancel: vi.fn(),
  };
}

/** Задача, которая отдаёт актору переданную команду. Нужна, чтобы проверить общее поведение задач-команд */
export class TestCommandTask extends CommandTask {
  readonly name = 'test';

  private readonly command: () => IActorCommand;

  constructor(command: () => IActorCommand) {
    super();
    this.command = command;
  }

  applyEffects(state: NpcState): NpcState {
    return state;
  }

  protected createCommand(): IActorCommand {
    return this.command();
  }
}

/** Создаёт место. Поля, которые не переданы, заполняются незначимыми значениями */
export function createPlace(place: Partial<PlaceData> = {}): PlaceData {
  return {
    id: 'shop',
    type: PlaceType.Shop,
    position: { x: 0, y: 0, z: 0 },
    angle: 0,
    ...place,
  };
}

/** Составляет план корневой задачи */
export function plan(
  root: Task<NpcState, NpcContext>,
  state: NpcState
): PrimitiveTask<NpcState, NpcContext>[] | null {
  return new Planner<NpcState>().plan(root, state);
}

/** Возвращает названия задач плана или null, если план составить нельзя */
export function planNames(root: Task<NpcState, NpcContext>, state: NpcState): string[] | null {
  const tasks = plan(root, state);

  return tasks && tasks.map((task) => task.name);
}

/** Применяет к состоянию эффекты всех задач плана по очереди */
export function applyPlanEffects(root: Task<NpcState, NpcContext>, state: NpcState): NpcState {
  const tasks = plan(root, state) ?? [];

  return tasks.reduce((current, task) => task.applyEffects(current), state);
}

/**
 * Создаёт фабрику задач. Методы, которые не переданы, создают настоящие задачи. Значимые для теста
 * методы передаются моками, чтобы проверить, с какими параметрами их вызвали
 */
export function createTaskFactory(factory: Partial<ITaskFactory> = {}): ITaskFactory {
  const real = new TaskFactory({ geometry: new Geometry() });

  return {
    goToCoords: (options) => real.goToCoords(options),
    achieveAngle: (options) => real.achieveAngle(options),
    playAnimation: (options) => real.playAnimation(options),
    addItem: (options) => real.addItem(options),
    removeItem: (options) => real.removeItem(options),
    ...factory,
  };
}
