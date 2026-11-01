import type {
  Deed,
  FeelingName,
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
  private readonly traits: ITrait[] = [];
  private readonly feelings = new Map<FeelingName, number>();

  /**
   * Создаёт черты фабриками из зависимостей. Если для черты нет фабрики, выбрасывает Error. Если
   * чувство не конечное число или вне пределов, выбрасывает RangeError
   * @param state - начальное состояние, например слепок другой психики
   */
  constructor(state: PsycheState, deps: PsycheDeps) {
    const { traitFactories } = deps;

    this.traitValues = { ...state.traits };
    Object.entries(state.traits).forEach(([name, value]) => {
      const factory = traitFactories[name];
      if (!factory) {
        throw new Error(`Нет фабрики для черты ${name}`);
      }

      this.traits.push(factory.create(value));
    });
    Object.entries(state.feelings).forEach(([name, value]) => {
      assertFeeling(name, value);
      this.feelings.set(name, value);
    });
  }

  getState(): PsycheState {
    return { traits: { ...this.traitValues }, feelings: this.getFeelings() };
  }

  /**
   * Чувство, которого ещё нет, начинается с MIN_FEELING. Пределы применяются к сумме вкладов, а
   * не к каждому вкладу отдельно. Если вклад не конечное число, выбрасывает RangeError и чувства
   * не меняет
   */
  react(deed: Deed): void {
    const changes = new Map<FeelingName, number>();

    this.traits.forEach((trait) => {
      Object.entries(trait.react(deed)).forEach(([name, change]) => {
        if (change === undefined) {
          return;
        }

        if (!Number.isFinite(change)) {
          throw new RangeError(`Вклад в чувство ${name} должен быть конечным числом: ${change}`);
        }

        changes.set(name, (changes.get(name) ?? 0) + change);
      });
    });

    changes.forEach((change, name) => {
      const value = (this.feelings.get(name) ?? MIN_FEELING) + change;
      this.feelings.set(name, Math.min(MAX_FEELING, Math.max(MIN_FEELING, value)));
    });
  }

  private getFeelings(): PsycheFeelings {
    const feelings: Record<FeelingName, number> = {};
    this.feelings.forEach((value, name) => {
      feelings[name] = value;
    });
    return feelings;
  }
}

function assertFeeling(name: FeelingName, value: number): void {
  if (!Number.isFinite(value) || value < MIN_FEELING || value > MAX_FEELING) {
    throw new RangeError(
      `Чувство ${name} должно быть числом от ${MIN_FEELING} до ${MAX_FEELING}, получено ${value}`
    );
  }
}
