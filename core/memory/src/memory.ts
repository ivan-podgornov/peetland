import type { Fact, MemoryMap } from './types';

/**
 * Память только на чтение. Так память лежит в состоянии NPC: планирование вспоминает факты, а
 * эффекты задач пишут в копию из clone() (см. NpcContext)
 */
export interface IReadonlyMemory {
  /**
   * Возвращает факты запрошенного типа в порядке запоминания
   * @param type - тип фактов
   */
  recall<K extends keyof MemoryMap>(type: K): ReadonlyArray<Extract<Fact, { type: K }>>;

  /** Возвращает копию памяти, в которую можно писать. Копия исходную память не меняет */
  clone(): IMemory;
}

/** Память NPC, в которую можно запоминать */
export interface IMemory extends IReadonlyMemory {
  /**
   * Запоминает факт: тип, детали и момент игрового времени, когда его запомнили. Момент передаёт
   * вызывающий, обычно задача берёт его из своего состояния (см. NpcState)
   * @param fact - факт
   */
  remember(fact: Fact): void;
}

/** Память NPC: факты о том, что с ним было */
export class Memory implements IMemory {
  private facts: Fact[] = [];

  recall<K extends keyof MemoryMap>(type: K): ReadonlyArray<Extract<Fact, { type: K }>> {
    return this.facts.filter((fact): fact is Extract<Fact, { type: K }> => fact.type === type);
  }

  clone(): IMemory {
    const clone = new Memory();

    clone.facts = [...this.facts];

    return clone;
  }

  remember(fact: Fact): void {
    this.facts.push(fact);
  }
}
