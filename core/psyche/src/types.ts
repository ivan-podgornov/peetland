import type { Deed } from './deed';
import type { Feeling } from './feeling';
import type { Modifier } from './modifier';
import type { Trait } from './trait';

/** Значение каждой черты характера. Черты не меняются со временем */
export type PsycheTraits = Readonly<Record<Trait, number>>;

/** Значение каждого чувства от MIN_FEELING до MAX_FEELING */
export type PsycheFeelings = Readonly<Record<Feeling, number>>;

/** Вклад черты в чувства: на сколько изменить каждое чувство. Чувств без изменений в объекте нет */
export type FeelingsContribution = Readonly<Partial<Record<Feeling, number>>>;

/**
 * Вклад черты в модификаторы: на что умножить каждый модификатор. Модификаторов без изменений в
 * объекте нет
 */
export type ModifiersContribution = Readonly<Partial<Record<Modifier, number>>>;

/** Состояние психики. Содержит только данные и полностью описывает психику */
export type PsycheState = Readonly<{
  traits: PsycheTraits;
  feelings: PsycheFeelings;
}>;

/** Черта характера. Решает, как поступок меняет чувства и на что умножаются модификаторы */
export interface ITrait {
  /** Возвращает вклад черты в чувства после поступка */
  react(deed: Deed): FeelingsContribution;
  /** Возвращает вклад черты в модификаторы */
  getModifiers(): ModifiersContribution;
}

export interface ITraitFactory {
  /** Создаёт черту с переданным значением */
  create(value: number): ITrait;
}

/** Фабрика каждой черты */
export type TraitFactories = Readonly<Record<Trait, ITraitFactory>>;
