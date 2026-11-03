import type { Vector3 } from '@peetland/geometry';
import type { InventoryCounts } from '@peetland/inventory';
import type { Feeling, PsycheFeelings, PsycheTraits, Trait } from '@peetland/psyche';
import { createPsycheState } from '@peetland/psyche/dev';
import type { TimeState } from '@peetland/timings';

import type { NpcState } from '../src';

/**
 * Собирает состояние NPC по шагам. То, что не задано, заполняется незначимыми значениями: NPC стоит
 * в начале координат, смотрит под углом 0, инвентарь пуст, черты и чувства как в createPsycheState,
 * а в мире полночь первого дня. Каждый вызов build возвращает новое состояние
 *
 * @example
 * const state = new NpcStateBuilder()
 *   .withInventory({ [Item.Money]: 50 })
 *   .withFeeling(Feeling.Shame, 30)
 *   .build();
 */
export class NpcStateBuilder {
  private position: Vector3 = {
    x: 0,
    y: 0,
    z: 0,
  };
  private angle = 0;
  private inventory: InventoryCounts = {};
  private traits: PsycheTraits;
  private feelings: PsycheFeelings;
  private time: TimeState = {
    day: 1,
    hours: 0,
    minutes: 0,
  };

  constructor() {
    const psyche = createPsycheState();
    this.traits = psyche.traits;
    this.feelings = psyche.feelings;
  }

  /** Задаёт позицию актора */
  withPosition(position: Vector3): this {
    this.position = position;
    return this;
  }

  /** Задаёт угол поворота актора в градусах */
  withAngle(angle: number): this {
    this.angle = angle;
    return this;
  }

  /** Задаёт инвентарь целиком: какие предметы и сколько их у NPC */
  withInventory(inventory: InventoryCounts): this {
    this.inventory = inventory;
    return this;
  }

  /** Опустошает инвентарь. Нужен, когда пустой инвентарь значим для теста */
  withEmptyInventory(): this {
    return this.withInventory({});
  }

  /** Задаёт значение черты характера */
  withTrait(trait: Trait, value: number): this {
    this.traits = {
      ...this.traits,
      [trait]: value,
    };
    return this;
  }

  /** Задаёт значение чувства */
  withFeeling(feeling: Feeling, value: number): this {
    this.feelings = {
      ...this.feelings,
      [feeling]: value,
    };
    return this;
  }

  /** Задаёт время суток в мире */
  withTime(time: TimeState): this {
    this.time = time;
    return this;
  }

  /** Возвращает собранное состояние */
  build(): NpcState {
    return {
      self: {
        actor: {
          position: { ...this.position },
          angle: this.angle,
        },
        inventory: { ...this.inventory },
        psyche: {
          traits: { ...this.traits },
          feelings: { ...this.feelings },
        },
      },
      world: {
        time: { ...this.time },
      },
    };
  }
}
