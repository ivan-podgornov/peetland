import { Command } from '@peetland/actor-command';
import type { CommandDeps, CommandStatus } from '@peetland/actor-command';
import type { AchieveAngleOptions, IActor } from '@peetland/game';
import type { IGeometry } from '@peetland/geometry';

export type VirtualAchieveAngleCommandDeps = CommandDeps & {
  geometry: IGeometry;
};

/**
 * Через секунду сразу поворачивает виртуального актора на угол, без промежуточных значений, и
 * сообщает его угол. Если актор уже повёрнут как нужно, команда выполняется сразу
 */
export class VirtualAchieveAngleCommand extends Command<
  number,
  AchieveAngleOptions,
  VirtualAchieveAngleCommandDeps
> {
  /** Актор поворачивается через секунду после начала команды */
  private static readonly CONFIG = {
    name: 'achieve-angle',
    updatePeriod: 1000,
  };

  constructor(actor: IActor, options: AchieveAngleOptions, deps: VirtualAchieveAngleCommandDeps) {
    super(VirtualAchieveAngleCommand.CONFIG, actor, options, deps);
  }

  protected onUpdate(elapsed: number): CommandStatus {
    const { angle, tolerance } = this.options;
    const { geometry } = this.deps;

    if (elapsed > 0) {
      this.actor.setAngle(angle);
    }

    const current = this.actor.getAngle();
    this.emit(current);

    return geometry.isWithinAngle(current, angle, tolerance) ? 'success' : 'running';
  }

  /** Виртуальный актёр не занимает ресурсов, освобождать нечего */
  protected onFinish(): void {}
}
