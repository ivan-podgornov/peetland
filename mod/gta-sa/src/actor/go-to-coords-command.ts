import { Command } from '@peetland/actor-command';
import type { CommandDeps, CommandStatus } from '@peetland/actor-command';
import type { GoToCoordsOptions, IActor } from '@peetland/game';
import type { IGeometry, Vector3 } from '@peetland/geometry';
import type { ILogger } from '@peetland/logger';
import type { PedHandle } from '@peetland/moonloader';
import {
  clearCharTasksImmediately,
  getClosestCharNode,
  taskGoToObject,
} from '@peetland/moonloader';

import type { IGtaObject, IGtaObjectFactory } from '../object';

export type GtaGoToCoordsCommandOptions = GoToCoordsOptions & {
  /** Персонаж, которого нужно вести к точке */
  handle: PedHandle;
};

export type GtaGoToCoordsCommandDeps = CommandDeps & {
  geometry: IGeometry;
  logger: ILogger;
  objectFactory: IGtaObjectFactory;
};

/** Команда проверяет, пришёл ли персонаж, раз в секунду */
const GO_TO_COORDS = {
  name: 'go-to-coords',
  updatePeriod: 1000,
};

/** Id модели конуса, к которому идёт персонаж */
const TARGET_MODEL_ID = 3283;

/** Раз в сколько обновлений команда проверяет, не застрял ли персонаж */
const STUCK_CHECK_UPDATES = 20;

/** Если за STUCK_CHECK_UPDATES обновлений персонаж сдвинулся не больше, чем на столько метров, он застрял */
const STUCK_DISTANCE = 7;

/**
 * Ведёт игрового персонажа к точке и раз в секунду сообщает его позицию. Игра ведёт персонажа к
 * ближайшему узлу путей пешеходов, и, если узел за стеной, персонаж упирается в неё. Поэтому, если за
 * STUCK_CHECK_UPDATES обновлений персонаж сдвинулся не больше, чем на STUCK_DISTANCE, команда пишет
 * об этом в лог и переносит его на ближайший узел: оттуда игра ведёт его дальше по узлам
 */
export class GtaGoToCoordsCommand extends Command<
  Vector3,
  GtaGoToCoordsCommandOptions,
  GtaGoToCoordsCommandDeps
> {
  /** Невидимый объект в точке, к которому идёт персонаж. null, пока команда не началась */
  private target: IGtaObject | null;
  /** Где был персонаж в начале текущей проверки застревания. null, пока команда не обновлялась */
  private checkpoint: Vector3 | null;
  /** Сколько обновлений прошло с начала текущей проверки застревания */
  private updatesSinceCheckpoint: number;

  constructor(actor: IActor, options: GtaGoToCoordsCommandOptions, deps: GtaGoToCoordsCommandDeps) {
    super(GO_TO_COORDS, actor, options, deps);
    this.target = null;
    this.checkpoint = null;
    this.updatesSinceCheckpoint = 0;
  }

  /** Ставит в точку невидимый объект и отправляет к нему персонажа */
  protected override onStart(): void {
    const { objectFactory } = this.deps;
    const target = objectFactory.create({
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
    const { geometry } = this.deps;
    const position = this.actor.getPosition();
    this.emit(position);

    if (geometry.isWithinRadius2d(position, coords, completeRadius)) {
      return 'success';
    }

    this.checkStuck(position);
    return 'running';
  }

  /**
   * Раз в STUCK_CHECK_UPDATES обновлений сравнивает позицию персонажа с той, что была в начале
   * проверки, и, если он застрял, переносит его на ближайший узел путей пешеходов
   */
  private checkStuck(position: Vector3): void {
    if (!this.checkpoint) {
      this.checkpoint = position;
      return;
    }

    this.updatesSinceCheckpoint += 1;

    if (this.updatesSinceCheckpoint < STUCK_CHECK_UPDATES) {
      return;
    }

    const { geometry } = this.deps;
    const stuck = geometry.isWithinRadius2d(position, this.checkpoint, STUCK_DISTANCE);
    this.checkpoint = stuck ? this.teleportToClosestNode(position) : position;
    this.updatesSinceCheckpoint = 0;
  }

  /** Пишет в лог, что персонаж застрял, переносит его на ближайший узел и возвращает узел */
  private teleportToClosestNode(position: Vector3): Vector3 {
    const { geometry, logger } = this.deps;
    const [x, y, z] = getClosestCharNode(position.x, position.y, position.z);
    const node = {
      x,
      y,
      z,
    };

    const from = geometry.formatPoint(position);
    const to = geometry.formatPoint(this.options.coords);
    logger.warn(
      `Персонаж застрял на ${from} по пути к ${to}, переносим на узел ${geometry.formatPoint(node)}`
    );
    this.actor.setPosition(node);

    return node;
  }

  protected override onFinish(): void {
    if (!this.target) {
      return;
    }

    this.target.remove();
    clearCharTasksImmediately(this.options.handle);
  }
}
