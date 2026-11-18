/** Потребность NPC: значение, которое само падает со временем и восполняется занятиями */
export enum Need {
  /** Сытость: падает, пока NPC не ест */
  Satiety = 'satiety',
  /** Алкоголизм: падает, пока NPC не пьёт, тем быстрее, чем сильнее зависимость */
  Alcoholism = 'alcoholism',
}

/** Потребности категории NeedCategory.Addiction: зависимости, у которых есть сила */
export type Addiction = Need.Alcoholism;
