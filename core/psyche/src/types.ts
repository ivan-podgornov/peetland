/** Название черты характера, например 'conscientiousness' */
export type TraitName = string;

/** Название чувства, например 'shame' */
export type FeelingName = string;

/** Название поступка, на который реагирует психика, например 'begging' */
export type Deed = string;

/** Значение каждой черты характера. Черты не меняются со временем */
export type PsycheTraits = Readonly<Record<TraitName, number>>;

/** Значение каждого чувства от MIN_FEELING до MAX_FEELING */
export type PsycheFeelings = Readonly<Record<FeelingName, number>>;

/** Вклад черты в чувства: на сколько изменить каждое чувство. Чувств без изменений в объекте нет */
export type FeelingsContribution = Readonly<Partial<Record<FeelingName, number>>>;

/** Состояние психики. Содержит только данные и полностью описывает психику */
export type PsycheState = Readonly<{
  traits: PsycheTraits;
  feelings: PsycheFeelings;
}>;

/** Черта характера. Решает, как поступок меняет чувства */
export interface ITrait {
  /** Возвращает вклад черты в чувства после поступка */
  react(deed: Deed): FeelingsContribution;
}

export interface ITraitFactory {
  /** Создаёт черту с переданным значением */
  create(value: number): ITrait;
}

/** Фабрики черт по их названиям */
export type TraitFactories = Readonly<Record<TraitName, ITraitFactory>>;
