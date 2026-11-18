/** Насколько NPC тянет к зависимости */
export enum AddictionStatus {
  /** Тянет: NPC хочет употребить */
  Craving = 'craving',
  /** Между порогами: уже не тянет, но ещё не спокоен */
  Moderate = 'moderate',
  /** Спокоен: употреблять не хочется */
  Calm = 'calm',
}
