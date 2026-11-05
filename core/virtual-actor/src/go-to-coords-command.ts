import { Command } from '@peetland/actor-command';
import type { CommandDeps, CommandStatus } from '@peetland/actor-command';
import type { GoToCoordsOptions, IActor } from '@peetland/game';
import type { IGeometry, Vector3 } from '@peetland/geometry';

export type VirtualGoToCoordsCommandDeps = CommandDeps & {
  geometry: IGeometry;
};

/** Раз в секунду двигает виртуального актора к точке по прямой и сообщает его позицию */
export class VirtualGoToCoordsCommand extends Command<
  Vector3,
  GoToCoordsOptions,
  VirtualGoToCoordsCommandDeps
> {
  /** Скорость пешехода: 5 км/ч в метрах в секунду */
  private static readonly WALKING_SPEED = 5 / 3.6;

  /** Актор делает шаг к точке раз в секунду */
  private static readonly CONFIG = {
    name: 'go-to-coords',
    updatePeriod: 1000,
  };

  constructor(actor: IActor, options: GoToCoordsOptions, deps: VirtualGoToCoordsCommandDeps) {
    super(VirtualGoToCoordsCommand.CONFIG, actor, options, deps);
  }

  protected onUpdate(elapsed: number): CommandStatus {
    const { coords, completeRadius } = this.options;
    const { geometry } = this.deps;
    const distance = (VirtualGoToCoordsCommand.WALKING_SPEED * elapsed) / 1000;
    const position = geometry.moveTowards(this.actor.getPosition(), coords, distance);

    this.actor.setPosition(position);
    this.emit(position);

    return geometry.isWithinRadius2d(position, coords, completeRadius) ? 'success' : 'running';
  }

  /** Виртуальный актёр не занимает ресурсов, освобождать нечего */
  protected onFinish(): void {}
}
