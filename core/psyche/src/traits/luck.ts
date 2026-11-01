import type { Deed } from '../deed';
import type { FeelingsContribution, ITrait, ITraitFactory } from '../types';

/** Удачливость. Пока ни на что не влияет, а позже будет влиять на шансы NPC */
export class Luck implements ITrait {
  /** Удачливость не меняет чувства */
  react(_deed: Deed): FeelingsContribution {
    return {};
  }
}

export class LuckFactory implements ITraitFactory {
  create(_value: number): ITrait {
    return new Luck();
  }
}
