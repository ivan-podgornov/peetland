import { AnimationManager, InstantAnimationLoader } from '@peetland/animation-manager';
import { AbortController, EventTarget } from '@peetland/events';
import type { IAbortSignal, Observable } from '@peetland/events';
import { ActorRegistry } from '@peetland/game';
import type { IActorFactory, IGame, IObjectFactory } from '@peetland/game';
import { Geometry } from '@peetland/geometry';
import type { IGeometry } from '@peetland/geometry';
import { ManualTime, ManualTimer } from '@peetland/timings';
import type { IReadonlyTime } from '@peetland/timings';
import { VIRTUAL_ANIMATIONS, VirtualActorFactory } from '@peetland/virtual-actor';

import { VirtualObjectFactory } from './object-factory';

/** Как часто игра сообщает о тике мира, в миллисекундах */
const TICK_PERIOD = 250;

export type VirtualGameDeps = {
  /** Время суток игры. По умолчанию — ManualTime, стоящий в полночь первого дня */
  time?: IReadonlyTime;
  /** Геометрия. По умолчанию — Geometry */
  geometry?: IGeometry;
  /** Фабрика объектов. По умолчанию — VirtualObjectFactory */
  objectFactory?: IObjectFactory;
  /** Фабрика акторов. По умолчанию — VirtualActorFactory с общим реестром игры */
  actorFactory?: IActorFactory;
};

/** Игра, которая работает без GTA и хранит всё в памяти. Время и тики двигает вручную */
export class VirtualGame implements IGame {
  readonly actorFactory: IActorFactory;
  /** Общий реестр акторов игры. В него попадают акторы фабрики по умолчанию */
  readonly actorRegistry: ActorRegistry;
  readonly time: IReadonlyTime;
  readonly geometry: IGeometry;
  readonly objectFactory: IObjectFactory;
  readonly ticks: Observable<unknown>;

  private readonly timer: ManualTimer;
  private readonly tickEvents: EventTarget<{ tick: [] }>;
  private readonly terminateController: AbortController;

  constructor(deps: VirtualGameDeps = {}) {
    this.terminateController = new AbortController();
    const { signal } = this.terminateController;

    // Таймер один на игру: по нему идут и тики мира, и команды акторов, поэтому advanceTime
    // двигает всё сразу
    this.timer = new ManualTimer();
    this.tickEvents = new EventTarget<{ tick: [] }>();
    this.timer.interval(TICK_PERIOD).subscribe(() => this.tickEvents.dispatchEvent('tick'), {
      signal,
    });
    this.ticks = this.tickEvents.when('tick');

    this.time = deps.time ?? new ManualTime();
    this.geometry = deps.geometry ?? new Geometry();
    this.objectFactory = deps.objectFactory ?? new VirtualObjectFactory();
    this.actorRegistry = new ActorRegistry();
    this.actorFactory =
      deps.actorFactory ??
      new VirtualActorFactory({
        actorRegistry: this.actorRegistry,
        animations: new AnimationManager(
          { animations: VIRTUAL_ANIMATIONS },
          { loader: new InstantAnimationLoader() }
        ),
        geometry: this.geometry,
        timer: this.timer,
      });
  }

  /** Прерывает сигнал игры: кто что создал в игре, тот по этому сигналу это и убирает */
  terminate(): void {
    this.terminateController.abort(new Error('Игра завершена'));
  }

  get signal(): IAbortSignal {
    return this.terminateController.signal;
  }

  /** Продвигает внутреннее время игры на ms миллисекунд */
  advanceTime(ms: number): void {
    this.timer.advance(ms);
  }

  /** Производит один тик мира */
  tick(): void {
    this.tickEvents.dispatchEvent('tick');
  }
}
