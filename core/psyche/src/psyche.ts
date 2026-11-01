import type { Deed } from './deed';
import { Feeling } from './feeling';
import { Trait } from './trait';
import type {
  FeelingsContribution,
  ITrait,
  PsycheFeelings,
  PsycheState,
  PsycheTraits,
  TraitFactories,
} from './types';

/** Минимальное значение чувства */
export const MIN_FEELING = 0;

/** Максимальное значение чувства */
export const MAX_FEELING = 100;

export interface IPsyche {
  /** Возвращает состояние психики. Из него фабрика собирает такую же психику */
  getState(): PsycheState;
  /** Прогоняет поступок через черты и меняет чувства на сумму их вкладов */
  react(deed: Deed): void;
}

export type PsycheDeps = {
  /** Фабрики, которыми психика создаёт черты из состояния */
  traitFactories: TraitFactories;
};

/**
 * Психика хранит черты характера и чувства. На поступок психика отвечает так: каждая черта
 * возвращает свой вклад в чувства, психика складывает вклады и держит чувства в пределах от
 * MIN_FEELING до MAX_FEELING. Психика, собранная из состояния, реагирует так же, как исходная
 */
export class Psyche implements IPsyche {
  private readonly traitValues: PsycheTraits;
  private readonly traits: ITrait[];
  private feelings: PsycheFeelings;

  /**
   * Создаёт черты фабриками из зависимостей. Если чувство не конечное число или вне пределов,
   * выбрасывает RangeError
   * @param state - начальное состояние, например слепок другой психики
   */
  constructor(state: PsycheState, deps: PsycheDeps) {
    const { traitFactories } = deps;

    Object.values(Feeling).forEach((feeling) =>
      this.assertFeeling(feeling, state.feelings[feeling])
    );

    this.traitValues = state.traits;
    this.feelings = state.feelings;
    this.traits = Object.values(Trait).map((trait) =>
      traitFactories[trait].create(state.traits[trait])
    );
  }

  getState(): PsycheState {
    return { traits: this.traitValues, feelings: this.feelings };
  }

  /**
   * Пределы применяются к сумме вкладов, а не к каждому вкладу отдельно. Если вклад не конечное
   * число, выбрасывает RangeError и чувства не меняет
   */
  react(deed: Deed): void {
    const contributions = this.traits.map((trait) => trait.react(deed));

    this.feelings = Object.values(Feeling).reduce<PsycheFeelings>((feelings, feeling) => {
      const change = contributions.reduce(
        (sum, contribution) => sum + this.getChange(contribution, feeling),
        0
      );

      return { ...feelings, [feeling]: this.clampFeeling(feelings[feeling] + change) };
    }, this.feelings);
  }

  /** Возвращает, на сколько вклад меняет чувство. Если вклад не конечное число, выбрасывает RangeError */
  private getChange(contribution: FeelingsContribution, feeling: Feeling): number {
    const change = contribution[feeling] ?? 0;
    if (!Number.isFinite(change)) {
      throw new RangeError(`Вклад в чувство ${feeling} должен быть конечным числом: ${change}`);
    }

    return change;
  }

  private clampFeeling(value: number): number {
    return Math.min(MAX_FEELING, Math.max(MIN_FEELING, value));
  }

  private assertFeeling(feeling: Feeling, value: number): void {
    if (!Number.isFinite(value) || value < MIN_FEELING || value > MAX_FEELING) {
      throw new RangeError(
        `Чувство ${feeling} должно быть числом от ${MIN_FEELING} до ${MAX_FEELING}, получено ${value}`
      );
    }
  }
}
