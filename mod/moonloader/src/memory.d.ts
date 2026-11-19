declare module 'memory' {
  /**
   * Записывает в память игры беззнаковое 32-битное число
   * @param address - адрес
   * @param value - число
   * @param unprotect - снять ли защиту памяти перед записью
   */
  export function setuint32(
    this: void,
    address: number,
    value: number,
    unprotect?: boolean
  ): boolean;

  /**
   * Читает из памяти игры беззнаковое 32-битное число
   * @param address - адрес
   * @param unprotect - снять ли защиту памяти перед чтением
   */
  export function getuint32(this: void, address: number, unprotect?: boolean): number;
}
