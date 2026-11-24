import type { IReadonlyTime } from '@peetland/timings';

import type { MemoryDetailsMap, MemoryMap, MemoryRecord } from './types';

/**
 * Память только на чтение. Так память лежит в состоянии NPC: планирование вспоминает записи, а
 * запоминают через контекст (см. NpcContext)
 */
export interface IReadonlyMemory<Map extends MemoryDetailsMap = MemoryMap> {
  /**
   * Возвращает записи запрошенного типа в порядке запоминания
   * @param type - тип записей
   */
  recall<K extends keyof Map>(type: K): ReadonlyArray<MemoryRecord<Map, K>>;
}

/** Память NPC, в которую можно запоминать */
export interface IMemory<Map extends MemoryDetailsMap = MemoryMap> extends IReadonlyMemory<Map> {
  /**
   * Запоминает запись с моментом игрового времени, когда её запомнили
   * @param type - тип записи
   * @param details - детали записи своего типа
   */
  remember<K extends keyof Map>(type: K, details: Map[K]): void;
}

export type MemoryDeps = {
  /** Время мира, из которого память берёт момент запоминания записей */
  time: IReadonlyTime;
};

/** Память NPC: записи о том, что с ним было */
export class Memory<Map extends MemoryDetailsMap = MemoryMap> implements IMemory<Map> {
  private readonly deps: MemoryDeps;
  private readonly records: MemoryRecord<Map, keyof Map>[];

  constructor(deps: MemoryDeps) {
    this.deps = deps;
    this.records = [];
  }

  recall<K extends keyof Map>(type: K): ReadonlyArray<MemoryRecord<Map, K>> {
    return this.records.filter((record): record is MemoryRecord<Map, K> => record.type === type);
  }

  remember<K extends keyof Map>(type: K, details: Map[K]): void {
    const { time } = this.deps;

    this.records.push({
      type,
      details,
      rememberedAt: time.getState(),
    });
  }
}
