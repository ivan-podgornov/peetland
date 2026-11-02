import type { FeelingsContribution, ITrait, ITraitFactory } from '../types';

/** Удачливость. Пока ни на что не влияет, а позже будет влиять на шансы NPC */
export class Luck implements ITrait {
  /** Удачливость не меняет чувства */
  react(): FeelingsContribution {
    return {};
  }
}

export class LuckFactory implements ITraitFactory {
  create(): ITrait {
    return new Luck();
  }
}
