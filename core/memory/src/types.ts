import type { TimeState } from '@peetland/timings';

/** Что NPC запоминает: карта «тип факта → детали» */
export type MemoryMap = {
  /** Место занято: в деталях — какое место NPC помнит занятым */
  placeTaken: {
    placeId: string;
  };
  /** Мусорка исследована: в деталях — какая мусорка была исследована */
  binSearched: {
    placeId: string;
  };
};

/** Факт памяти: тип, детали своего типа и момент игрового времени, когда его запомнили */
export type Fact = {
  [K in keyof MemoryMap]: Readonly<{
    /** Тип факта */
    type: K;
    /** Детали своего типа (см. MemoryMap) */
    details: MemoryMap[K];
    /** Момент игрового времени, когда факт запомнили */
    rememberedAt: TimeState;
  }>;
}[keyof MemoryMap];
