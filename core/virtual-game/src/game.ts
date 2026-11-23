import { AnimationManager, InstantAnimationLoader } from '@peetland/animation-manager';
import { AbortController, EventTarget } from '@peetland/events';
import type { IAbortSignal, Observable } from '@peetland/events';
import { ActorRegistry } from '@peetland/game';
import type {
  GameEvents,
  IActor,
  IActorFactory,
  IActorRegistry,
  IGame,
  IObjectFactory,
} from '@peetland/game';
import { Geometry } from '@peetland/geometry';
import type { IGeometry } from '@peetland/geometry';
import { AlwaysClearLos, VisionSystemFactory } from '@peetland/perception';
import type { ILosProvider, IVisionSystem, IVisionSystemFactory } from '@peetland/perception';
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
  /** Фабрика акторов. По умолчанию — VirtualActorFactory с реестром игры */
  actorFactory?: IActorFactory;
  /** Реестр акторов игры. По умолчанию — ActorRegistry */
  actorRegistry?: IActorRegistry;
  /** Провайдер прямой видимости для системы зрения. По умолчанию — AlwaysClearLos: виртуальный мир прозрачен */
  los?: ILosProvider;
  /** Фабрика системы зрения. По умолчанию — VisionSystemFactory из @peetland/perception */
  visionSystemFactory?: IVisionSystemFactory;
};

/** Игра, которая хранит весь мир в памяти. Время игры двигается вручную */
export class VirtualGame implements IGame {
  readonly actorFactory: IActorFactory;
  readonly time: IReadonlyTime;
  readonly geometry: IGeometry;
  readonly objectFactory: IObjectFactory;
  readonly ticks: Observable<unknown>;

  private readonly timer: ManualTimer;
  private readonly tickEvents: EventTarget<GameEvents>;
  private readonly terminateController: AbortController;
  private readonly vision: IVisionSystem;

  constructor(deps: VirtualGameDeps = {}) {
    this.terminateController = new AbortController();
    const { signal } = this.terminateController;

    // Таймер один на игру: по нему идут и тики мира, и команды акторов, поэтому advanceTime
    // двигает всё сразу
    this.timer = new ManualTimer();
    this.tickEvents = new EventTarget<GameEvents>();
    this.timer.interval(TICK_PERIOD).subscribe(() => this.tickEvents.dispatchEvent('tick'), {
      signal,
    });
    this.ticks = this.tickEvents.when('tick');

    this.time = deps.time ?? new ManualTime();
    this.geometry = deps.geometry ?? new Geometry();
    this.objectFactory = deps.objectFactory ?? new VirtualObjectFactory();
    const actorRegistry = deps.actorRegistry ?? new ActorRegistry();
    this.actorFactory =
      deps.actorFactory ??
      new VirtualActorFactory({
        actorRegistry,
        animations: new AnimationManager(
          { animations: VIRTUAL_ANIMATIONS },
          { loader: new InstantAnimationLoader() }
        ),
        geometry: this.geometry,
        timer: this.timer,
      });
    this.vision = (deps.visionSystemFactory ?? new VisionSystemFactory()).create({
      registry: actorRegistry,
      los: deps.los ?? new AlwaysClearLos(),
      geometry: this.geometry,
    });
  }

  /** Прерывает сигнал игры: кто что создал в игре, тот по этому сигналу это и убирает */
  terminate(): void {
    this.terminateController.abort(new Error('Игра завершена'));
  }

  get signal(): IAbortSignal {
    return this.terminateController.signal;
  }

  /**
   * Продвигает внутреннее время игры на ms миллисекунд. Тики мира происходят автоматически — раз в
   * 250 миллисекунд продвинутого времени, то есть секунда — четыре тика
   */
  advanceTime(ms: number): void {
    this.timer.advance(ms);
  }

  getVisibleActors(target: IActor, radius: number): IActor[] {
    return this.vision.getVisibleActors(target, radius);
  }
}
