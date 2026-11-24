import type { TimeState } from '@peetland/timings';

/** Карта «тип записи → детали»: каждой записи памяти соответствуют свои детали, как типы событий у эмиттера */
export type MemoryDetailsMap = { [type: string]: unknown };

/** Что NPC запоминает */
export type MemoryMap = {
  /** Место занято: в деталях — какое место NPC помнит занятым */
  placeTaken: {
    placeId: string;
  };
};

/** Запись памяти: тип, детали и момент игрового времени, когда её запомнили */
export type MemoryRecord<Map extends MemoryDetailsMap, K extends keyof Map = keyof Map> = Readonly<{
  /** Тип записи */
  type: K;
  /** Детали своего типа (см. MemoryMap) */
  details: Map[K];
  /** Момент игрового времени, когда запись запомнили */
  rememberedAt: TimeState;
}>;
