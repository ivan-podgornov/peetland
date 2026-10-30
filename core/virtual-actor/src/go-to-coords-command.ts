import { Command } from '@peetland/actor-command';
import type { CommandDeps, CommandStatus } from '@peetland/actor-command';
import type { GoToCoordsOptions, IActor } from '@peetland/game';
import type { IGeometry, Vector3 } from '@peetland/geometry';

/** Скорость пешехода: 5 км/ч в метрах в секунду */
const WALKING_SPEED = 5 / 3.6;

/** Актор делает шаг к точке раз в секунду */
const GO_TO_COORDS = { name: 'go-to-coords', updatePeriod: 1000 };

export type VirtualGoToCoordsCommandDeps = CommandDeps & {
  geometry: IGeometry;
};

/** Раз в секунду двигает виртуального актора к точке по прямой и сообщает его позицию */
export class VirtualGoToCoordsCommand extends Command<
  Vector3,
  GoToCoordsOptions,
  VirtualGoToCoordsCommandDeps
> {
  constructor(actor: IActor, options: GoToCoordsOptions, deps: VirtualGoToCoordsCommandDeps) {
    super(GO_TO_COORDS, actor, options, deps);
  }

  protected onUpdate(elapsed: number): CommandStatus {
    const { coords, completeRadius } = this.options;
    const { geometry } = this.deps;
    const distance = (WALKING_SPEED * elapsed) / 1000;
    const position = geometry.moveTowards(this.actor.getPosition(), coords, distance);

    this.actor.setPosition(position);
    this.emit(position);

    return geometry.isWithinRadius2d(position, coords, completeRadius) ? 'success' : 'running';
  }
}
