import { Command } from '@peetland/actor-command';
import type { CommandDeps, CommandResult, CommandStatus } from '@peetland/actor-command';
import type { GoToCoordsOptions, IActor } from '@peetland/game';
import type { IGeometry, Vector3 } from '@peetland/geometry';
import type { PedHandle } from '@peetland/moonloader';
import { clearCharTasksImmediately, taskGoToObject } from '@peetland/moonloader';

import type { IGtaObject, IGtaObjectFactory } from '../object';

export type GtaGoToCoordsCommandOptions = GoToCoordsOptions & {
  /** Персонаж, которого нужно вести к точке */
  handle: PedHandle;
};

export type GtaGoToCoordsCommandDeps = CommandDeps & {
  geometry: IGeometry;
  objectFactory: IGtaObjectFactory;
};

/** Команда проверяет, пришёл ли персонаж, раз в секунду */
const GO_TO_COORDS = { name: 'go-to-coords', updatePeriod: 1000 };

/** Id модели конуса, к которому идёт персонаж */
const TARGET_MODEL_ID = 3283;

/** Ведёт игрового персонажа к точке и раз в секунду сообщает его позицию */
export class GtaGoToCoordsCommand extends Command<
  Vector3,
  GtaGoToCoordsCommandOptions,
  GtaGoToCoordsCommandDeps
> {
  /** Невидимый объект в точке, к которому идёт персонаж. null, пока команда не началась */
  private target: IGtaObject | null;

  constructor(actor: IActor, options: GtaGoToCoordsCommandOptions, deps: GtaGoToCoordsCommandDeps) {
    super(GO_TO_COORDS, actor, options, deps);
    this.target = null;
  }

  /** Ставит в точку невидимый объект и отправляет к нему персонажа */
  protected override onStart(): void {
    const target = this.deps.objectFactory.create({
      modelId: TARGET_MODEL_ID,
      position: this.options.coords,
    });

    target.freeze();
    target.setVisibility(false);
    target.setCollisionEnabled(false);

    taskGoToObject(this.options.handle, target.handle, -1, 0.1);
    this.target = target;
  }

  protected onUpdate(): CommandStatus {
    const { coords, completeRadius } = this.options;
    const position = this.actor.getPosition();
    this.emit(position);

    return this.deps.geometry.isWithinRadius2d(position, coords, completeRadius)
      ? 'success'
      : 'running';
  }

  protected override onFinish(_result: CommandResult): void {
    if (!this.target) {
      return;
    }

    this.target.remove();
    clearCharTasksImmediately(this.options.handle);
  }
}
