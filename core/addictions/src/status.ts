/** Насколько NPC тянет к зависимости */
export enum AddictionStatus {
  /** Тянет: NPC хочет употребить */
  Urgent = 'urgent',
  /** Между порогами: уже не тянет, но и не спокоен */
  Moderate = 'moderate',
  /** Спокоен: употреблять не хочется */
  Calm = 'calm',
}
