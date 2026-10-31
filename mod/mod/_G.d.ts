type AnyFunction = (...args: never[]) => unknown;

declare function setTimeout<Callback extends AnyFunction>(
  callback: Callback,
  delay?: number,
  ...args: Parameters<Callback>
): number;

declare function clearTimeout(timeoutId: number): void;

declare function setInterval<Callback extends AnyFunction>(
  callback: Callback,
  delay?: number,
  ...args: Parameters<Callback>
): number;

declare function clearInterval(intervalId: number): void;

/**
 * Сообщает об ошибке, которую некому обработать, например, об исключении в обработчике события.
 * Как reportError в браузерах
 */
declare function reportError(error: unknown): void;
