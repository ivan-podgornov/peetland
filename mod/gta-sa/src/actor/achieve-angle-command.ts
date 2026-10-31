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

/** Сколько миллисекунд персонаж может поворачиваться сам, прежде чем его повернут сразу */
const TURN_TIMEOUT = 1000;

/**
 * Поворачивает игрового персонажа на угол и сообщает его угол по мере поворота. Игра поворачивает
 * персонажа не всегда до конца, поэтому, если за секунду он не повернулся, команда сразу ставит
 * ему нужный угол
 */
export class GtaAchieveAngleCommand extends Command<
  number,
  GtaAchieveAngleCommandOptions,
  GtaAchieveAngleCommandDeps
> {
  /** Сколько миллисекунд персонаж уже поворачивается */
  private turningFor: number;

  constructor(
    actor: IActor,
    options: GtaAchieveAngleCommandOptions,
    deps: GtaAchieveAngleCommandDeps
  ) {
    super(ACHIEVE_ANGLE, actor, options, deps);
    this.turningFor = 0;
  }

  protected override onStart(): void {
    const { handle, angle } = this.options;
    const { geometry } = this.deps;

    taskAchieveHeading(handle, geometry.normalizeAngle(angle));
  }

  protected onUpdate(elapsed: number): CommandStatus {
    const { angle, tolerance } = this.options;
    const { geometry } = this.deps;
    this.turningFor += elapsed;

    if (this.turningFor >= TURN_TIMEOUT) {
      this.actor.setAngle(angle);
    }

    const current = this.actor.getAngle();
    this.emit(current);

    return geometry.isWithinAngle(current, angle, tolerance) ? 'success' : 'running';
  }

  protected override onFinish(_result: CommandResult): void {
    clearCharTasksImmediately(this.options.handle);
  }
}
