import type { IAbortSignal, Observable } from '@peetland/events';
import { setuint32 } from 'memory';

export type GtaClockDeps = {
  /** Тики мира, на которых часы выставляют длительность игровой минуты */
  ticks: Observable<unknown>;
  /** Сигнал выгрузки скрипта: по нему часы возвращают длительность по умолчанию */
  signal: IAbortSignal;
};

/**
 * Часы GTA: задают, сколько длится игровая минута. Игра может сбросить длительность, например при
 * загрузке сохранения, поэтому часы выставляют её на каждом тике
 */
export class GtaClock {
  /** Адрес CClock::ms_nMillisecondsPerGameMinute: сколько длится игровая минута, в миллисекундах */
  private static readonly MS_PER_GAME_MINUTE_ADDRESS = 0xb7015c;

  /** Сколько длится игровая минута в игре без мода, в миллисекундах: сутки — 24 минуты */
  private static readonly DEFAULT_MS_PER_GAME_MINUTE = 1000;

  /** Сколько длится игровая минута с модом, в миллисекундах: сутки — час */
  static readonly MS_PER_GAME_MINUTE = 2500;

  private readonly deps: GtaClockDeps;

  constructor(deps: GtaClockDeps) {
    this.deps = deps;
  }

  /** Выставляет длительность игровой минуты на каждом тике, пока скрипт не выгрузят */
  start(): void {
    const { ticks, signal } = this.deps;

    ticks.subscribe(() => this.setMsPerGameMinute(GtaClock.MS_PER_GAME_MINUTE), { signal });
    signal.addEventListener('abort', () =>
      this.setMsPerGameMinute(GtaClock.DEFAULT_MS_PER_GAME_MINUTE)
    );
  }

  private setMsPerGameMinute(ms: number): void {
    setuint32(GtaClock.MS_PER_GAME_MINUTE_ADDRESS, ms, true);
  }
}
