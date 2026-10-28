/**
 * Анимации, которые умеет проигрывать актор. Названия описывают, что делает персонаж, а не то,
 * какой анимацией игры это показано. Анимации могут быть незаконченными: например, «начать рыться
 * в мусорке», «рыться в мусорке» и «перестать рыться» — отдельные анимации, в цепочку их собирает
 * тот, кто ими управляет
 */
export type AnimationId =
  /** Приступить к рытью в мусорке */
  | 'trash-search-start'
  /** Рыться в мусорке */
  | 'trash-search'
  /** Посмотреть, что нашёл в мусорке, вариант 1 */
  | 'trash-search-look-1'
  /** Посмотреть, что нашёл в мусорке, вариант 2 */
  | 'trash-search-look-2'
  /** Положить найденное в карман */
  | 'trash-search-pocket'
  /** Перестать рыться в мусорке */
  | 'trash-search-end'
  /** Попрошайничать сидя */
  | 'beg-sitting'
  /** Отдать предмет */
  | 'item-give'
  /** Получить предмет */
  | 'item-receive'
  /** Оплатить что-либо */
  | 'pay'
  /** Пить стоя, вариант 1 */
  | 'drink-standing-1'
  /** Пить стоя, вариант 2 */
  | 'drink-standing-2';

/** Описание анимации, общее для всех реализаций актора */
export type AnimationInfo = {
  /**
   * Зацикленная анимация повторяется, пока не пройдёт время проигрывания. Это время передаёт тот,
   * кто запускает анимацию, потому что сама анимация не знает, сколько, например, рыться в мусорке
   */
  loop: boolean;
};

export const ANIMATIONS: Record<AnimationId, AnimationInfo> = {
  'trash-search-start': { loop: false },
  'trash-search': { loop: true },
  'trash-search-look-1': { loop: false },
  'trash-search-look-2': { loop: false },
  'trash-search-pocket': { loop: false },
  'trash-search-end': { loop: false },
  'beg-sitting': { loop: true },
  'item-give': { loop: false },
  'item-receive': { loop: false },
  pay: { loop: false },
  'drink-standing-1': { loop: true },
  'drink-standing-2': { loop: true },
};

/**
 * Проверяет время проигрывания анимации. Выбрасывает ошибку, если для зацикленной анимации время не
 * передано или для незацикленной передано. RangeError — если время не положительное конечное число
 * @param animation - какую анимацию проигрывают
 * @param duration - сколько её проигрывать, в миллисекундах
 */
export function assertPlaybackDuration(animation: AnimationId, duration?: number): void {
  const { loop } = ANIMATIONS[animation];

  if (loop && duration === undefined) {
    throw new Error(`Для зацикленной анимации ${animation} нужно передать время проигрывания`);
  }

  if (!loop && duration !== undefined) {
    throw new Error(`Для незацикленной анимации ${animation} нельзя передать время проигрывания`);
  }

  if (duration !== undefined && (!Number.isFinite(duration) || duration <= 0)) {
    throw new RangeError('Время проигрывания должно быть положительным конечным числом');
  }
}
