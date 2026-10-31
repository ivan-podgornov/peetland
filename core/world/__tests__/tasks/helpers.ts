import { createControlledObservable } from '@peetland/events/dev';
import type { IActor, IActorCommand } from '@peetland/game';
import { Inventory } from '@peetland/inventory';
import { createActor } from '@peetland/virtual-actor/dev';
import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import { CommandTask } from '../../src';
import type { NpcContext, NpcState } from '../../src';

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
