import { Command } from '@peetland/actor-command';
import type { CommandDeps, CommandResult, CommandStatus } from '@peetland/actor-command';
import type { AchieveAngleOptions, IActor } from '@peetland/game';
import type { IGeometry } from '@peetland/geometry';
import type { PedHandle } from '@peetland/moonloader';
import { clearCharTasksImmediately, taskAchieveHeading } from '@peetland/moonloader';

export type GtaAchieveAngleCommandOptions = AchieveAngleOptions & {
  /** Персонаж, которого нужно повернуть */
  handle: PedHandle;
};

export type GtaAchieveAngleCommandDeps = CommandDeps & {
  geometry: IGeometry;
};

/** Персонаж поворачивается быстрее секунды, поэтому команда проверяет угол часто */
const ACHIEVE_ANGLE = { name: 'achieve-angle', updatePeriod: 100 };

/** Поворачивает игрового персонажа на угол и сообщает его угол по мере поворота */
export class GtaAchieveAngleCommand extends Command<
  number,
  GtaAchieveAngleCommandOptions,
  GtaAchieveAngleCommandDeps
> {
  constructor(
    actor: IActor,
    options: GtaAchieveAngleCommandOptions,
    deps: GtaAchieveAngleCommandDeps
  ) {
    super(ACHIEVE_ANGLE, actor, options, deps);
  }

  protected override onStart(): void {
    const { handle, angle } = this.options;
    const { geometry } = this.deps;

    taskAchieveHeading(handle, geometry.normalizeAngle(angle));
  }

  protected onUpdate(): CommandStatus {
    const { angle, tolerance } = this.options;
    const { geometry } = this.deps;
    const current = this.actor.getAngle();
    this.emit(current);

    return geometry.isWithinAngle(current, angle, tolerance) ? 'success' : 'running';
  }

  protected override onFinish(_result: CommandResult): void {
    clearCharTasksImmediately(this.options.handle);
  }
}
