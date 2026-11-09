import type { Deed } from './deed';
import { Feeling } from './feeling';
import { Trait } from './trait';
import type {
  FeelingsContribution,
  ILuck,
  IOptimism,
  ITrait,
  PsycheFeelings,
  PsycheState,
  PsycheTraits,
  TraitFactories,
} from './types';

/**
 * Психика только на чтение. Так психика лежит в состоянии NPC: планирование читает её, а эффекты
 * задач пишут в копию из clone()
 */
export interface IReadonlyPsyche {
  /** Возвращает состояние психики. Из него фабрика собирает такую же психику */
  getState(): PsycheState;
  /**
   * Возвращает шанс, с которым персонажу везёт на самом деле: базовый шанс поправляет удачливость
   * @param chance - базовый шанс среднего персонажа от 0 до 1, например, 1 / 40
   */
  adjustChance(chance: number): number;
  /**
   * Возвращает, сколько попыток персонаж ожидает до удачи, когда планирует: решает оптимизм
   * @param chance - шанс удачи за одну попытку от 0 до 1, например, 1 / 40
   */
  expectAttempts(chance: number): number;
  /**
   * Возвращает копию психики, в которую можно писать: с теми же чертами и чувствами. Исходную
   * психику копия не меняет
   */
  clone(): IPsyche;
}

export interface IPsyche extends IReadonlyPsyche {
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
 * Psyche.MIN_FEELING до Psyche.MAX_FEELING. Психика, собранная из состояния, реагирует так же, как исходная
 */
export class Psyche implements IPsyche {
  /** Минимальное значение чувства */
  static readonly MIN_FEELING = 0;

  /** Максимальное значение чувства */
  static readonly MAX_FEELING = 100;

  private readonly deps: PsycheDeps;
  private readonly traitValues: PsycheTraits;
  private readonly traits: ITrait[];
  private readonly luck: ILuck;
  private readonly optimism: IOptimism;
  private feelings: PsycheFeelings;

  /**
   * Создаёт черты фабриками из зависимостей. Если чувство не конечное число или вне пределов,
   * выбрасывает RangeError
   * @param state - начальное состояние, например слепок другой психики
   */
  constructor(state: PsycheState, deps: PsycheDeps) {
    const { traitFactories } = deps;

    this.deps = deps;
    Object.values(Feeling).forEach((feeling) =>
      this.assertFeeling(feeling, state.feelings[feeling])
    );

    this.traitValues = state.traits;
    this.feelings = state.feelings;
    this.luck = traitFactories[Trait.Luck].create(state.traits[Trait.Luck]);
    this.optimism = traitFactories[Trait.Optimism].create(state.traits[Trait.Optimism]);
    this.traits = [
      traitFactories[Trait.Conscientiousness].create(state.traits[Trait.Conscientiousness]),
      this.luck,
      this.optimism,
    ];
  }

  getState(): PsycheState {
    return {
      traits: this.traitValues,
      feelings: this.feelings,
    };
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

      return {
        ...feelings,
        [feeling]: this.clampFeeling(feelings[feeling] + change),
      };
    }, this.feelings);
  }

  /** Черты копии собираются теми же фабриками черт, что и черты исходной психики */
  clone(): IPsyche {
    return new Psyche(this.getState(), this.deps);
  }

  adjustChance(chance: number): number {
    return this.luck.adjustChance(chance);
  }

  expectAttempts(chance: number): number {
    return this.optimism.expectAttempts(chance);
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
    return Math.min(Psyche.MAX_FEELING, Math.max(Psyche.MIN_FEELING, value));
  }

  private assertFeeling(feeling: Feeling, value: number): void {
    if (!Number.isFinite(value) || value < Psyche.MIN_FEELING || value > Psyche.MAX_FEELING) {
      throw new RangeError(
        `Чувство ${feeling} должно быть числом от ${Psyche.MIN_FEELING} до ${Psyche.MAX_FEELING}, получено ${value}`
      );
    }
  }
}
