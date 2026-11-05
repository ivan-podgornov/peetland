import type { Deed } from './deed';
import type { Feeling } from './feeling';
import type { Trait } from './trait';

/** Значение каждой черты характера. Черты не меняются со временем */
export type PsycheTraits = Readonly<Record<Trait, number>>;

/** Значение каждого чувства от Psyche.MIN_FEELING до Psyche.MAX_FEELING */
export type PsycheFeelings = Readonly<Record<Feeling, number>>;

/** Вклад черты в чувства: на сколько изменить каждое чувство. Чувств без изменений в объекте нет */
export type FeelingsContribution = Readonly<Partial<Record<Feeling, number>>>;

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

/** Удачливость. Кроме чувств, решает, с каким шансом персонажу везёт в игре */
export interface ILuck extends ITrait {
  /**
   * Возвращает шанс, с которым персонажу везёт на самом деле
   * @param chance - базовый шанс среднего персонажа от 0 до 1, например, 1 / 40
   */
  adjustChance(chance: number): number;
}

/** Оптимизм. Кроме чувств, решает, сколько попыток персонаж ожидает до удачи, когда планирует */
export interface IOptimism extends ITrait {
  /**
   * Возвращает, сколько попыток персонаж ожидает до удачи
   * @param chance - шанс удачи за одну попытку от 0 до 1, например, 1 / 40
   */
  expectAttempts(chance: number): number;
}

export interface ITraitFactory<T extends ITrait = ITrait> {
  /** Создаёт черту с переданным значением */
  create(value: number): T;
}

/** Фабрика каждой черты */
export type TraitFactories = Readonly<{
  [Trait.Conscientiousness]: ITraitFactory;
  [Trait.Luck]: ITraitFactory<ILuck>;
  [Trait.Optimism]: ITraitFactory<IOptimism>;
}>;
