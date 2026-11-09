import type { Vector3 } from '@peetland/geometry';
import { Inventory } from '@peetland/inventory';
import type { InventoryCounts } from '@peetland/inventory';
import type { IPsyche } from '@peetland/psyche';
import { PsycheBuilder } from '@peetland/psyche/dev';
import type { TimeState } from '@peetland/timings';

import type { NpcState } from '../src';

/** Собирает психику из переданного билдера психики */
type PsycheBuild = (builder: PsycheBuilder) => IPsyche;

/**
 * Собирает состояние NPC по шагам. То, что не задано, заполняется незначимыми значениями: NPC стоит
 * в начале координат, смотрит под углом 0, инвентарь пуст, психика как у PsycheBuilder по
 * умолчанию, а в мире полночь первого дня. Каждый вызов build возвращает новое состояние
 *
 * @example
 * const state = new NpcStateBuilder()
 *   .withInventory({ [Item.Money]: 50 })
 *   .withPsyche((psyche) => psyche.withFeeling(Feeling.Shame, 30).build())
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
  private psyche: PsycheBuild = (builder) => builder.build();
  private time: TimeState = {
    day: 1,
    hours: 0,
    minutes: 0,
  };

  /** Возвращает состояние, в котором тесту ничего не важно: всё заполнено значениями по умолчанию */
  static default(): NpcState {
    return new NpcStateBuilder().build();
  }

  /** Задаёт позицию актора */
  withPosition(x: number, y: number, z: number): this {
    this.position = {
      x,
      y,
      z,
    };
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

  /**
   * Задаёт психику: функция получает новый билдер психики и возвращает психику, которая ляжет в
   * состояние. Функция вызывается на каждый build, поэтому каждое состояние получает свою психику
   */
  withPsyche(psyche: PsycheBuild): this {
    this.psyche = psyche;
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
        inventory: new Inventory(this.inventory),
        psyche: this.psyche(new PsycheBuilder()),
      },
      world: {
        time: { ...this.time },
      },
    };
  }
}
