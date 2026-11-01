/**
 * Интерфейс Lua функций MoonLoader
 */
interface LuaGlobal {
  /** Класс для работы с Lua потоками в MoonLoader */
  readonly lua_thread: {
    /** Создаёт новый поток и сразу же запускает его с указанными параметрами */
    create<Args extends unknown[] = []>(
      this: void,
      thread: (...args: Args) => void,
      ...args: Args
    ): LuaThread<Args>;

    /** Создаёт новый поток в состоянии ожидания запуска */
    create_suspended<Args extends unknown[] = []>(
      this: void,
      thread: (...args: Args) => void
    ): LuaThread<Args>;
  };

  /** Стандартная библиотека Lua math */
  readonly math: {
    /** Задаёт начальное значение генератору случайных чисел math.random */
    randomseed(this: void, seed: number): void;
  };

  /** Стандартная библиотека Lua os */
  readonly os: {
    /** Возвращает текущее время в секундах */
    time(this: void): number;
  };
}

/** Класс для работы с Lua потоками в MoonLoader */
declare class LuaThread<Args extends unknown[]> {
  /** Выполняет замороженный, выполняющийся или завершённый поток с начала */
  run(...args: Args): void;

  /** Принудительно завершает поток */
  terminate(): void;

  /** Возвращает статус потока */
  status(): 'dead' | 'suspended' | 'running' | 'yielded' | 'error';

  /** Определяет статус завершённости потока */
  readonly dead: boolean;

  /** Определяет исполнение потока во время паузы игры */
  work_in_pause: boolean;
}

declare const _G: LuaGlobal;

export { LuaThread };

export const { lua_thread, math, os } = _G;
