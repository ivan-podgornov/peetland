import type { IAddictions } from '@peetland/addictions';
import { AddictionsBuilder } from '@peetland/addictions/dev';
import type { Vector3 } from '@peetland/geometry';
import { Inventory } from '@peetland/inventory';
import type { InventoryCounts } from '@peetland/inventory';
import { Memory } from '@peetland/memory';
import type { INeeds } from '@peetland/needs';
import { NeedsBuilder } from '@peetland/needs/dev';
import type { IPsyche } from '@peetland/psyche';
import { PsycheBuilder } from '@peetland/psyche/dev';
import { ManualTime } from '@peetland/timings';
import type { TimeState } from '@peetland/timings';

import { NpcKind } from '../src';
import type { INpc } from '../src';
import type { NpcState } from '../src';

/** Собирает психику из переданного билдера психики */
type PsycheBuild = (builder: PsycheBuilder) => IPsyche;

/** Собирает потребности из переданного билдера потребностей */
type NeedsBuild = (builder: NeedsBuilder) => INeeds;

/** Собирает зависимости из переданного билдера зависимостей */
type AddictionsBuild = (builder: AddictionsBuilder) => IAddictions;

/** Собирает видимых NPC: функция получает радиус запроса и возвращает NPC, которых видно в нём */
type VisibleNpcsBuild = (radius: number) => INpc[];

/**
 * Собирает состояние NPC по шагам. То, что не задано, заполняется незначимыми значениями: NPC —
 * бомж, стоит в начале координат, смотрит под углом 0, инвентарь пуст, психика как у PsycheBuilder
 * по умолчанию, потребности удовлетворены полностью, зависимостей нет, память пуста, NPC никого не
 * видит, а в мире полночь первого дня. Каждый вызов
 * build возвращает новое состояние
 *
 * @example
 * const state = new NpcStateBuilder()
 *   .withInventory({ [Item.Money]: 50 })
 *   .withPsyche((psyche) => psyche.withFeeling(Feeling.Shame, 30).build())
 *   .withNeeds((needs) => needs.withValue(Need.Satiety, 10).build())
 *   .build();
 */
export class NpcStateBuilder {
  private kind = NpcKind.Homeless;
  private position: Vector3 = {
    x: 0,
    y: 0,
    z: 0,
  };
  private angle = 0;
  private inventory: InventoryCounts = {};
  private psyche: PsycheBuild = (builder) => builder.build();
  private needs: NeedsBuild = (builder) => builder.build();
  private addictions: AddictionsBuild = (builder) => builder.build();
  private visibleNpcs: VisibleNpcsBuild = () => [];
  private time: TimeState = {
    day: 1,
    hours: 0,
    minutes: 0,
  };

  /** Возвращает состояние, в котором тесту ничего не важно: всё заполнено значениями по умолчанию */
  static default(): NpcState {
    return new NpcStateBuilder().build();
  }

  /** Задаёт тип NPC */
  withKind(kind: NpcKind): this {
    this.kind = kind;
    return this;
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

  /**
   * Задаёт потребности: функция получает новый билдер потребностей, значения которого выставлены на
   * время из состояния, и возвращает потребности, которые лягут в состояние. Функция вызывается на
   * каждый build, поэтому каждое состояние получает свои потребности
   */
  withNeeds(needs: NeedsBuild): this {
    this.needs = needs;
    return this;
  }

  /**
   * Задаёт зависимости: функция получает новый билдер зависимостей, значения которого выставлены на
   * время из состояния, и возвращает зависимости, которые лягут в состояние. Функция вызывается на
   * каждый build, поэтому каждое состояние получает свои зависимости
   */
  withAddictions(addictions: AddictionsBuild): this {
    this.addictions = addictions;
    return this;
  }

  /**
   * Задаёт видимых NPC: функция получает радиус запроса и возвращает NPC, которых NPC из состояния
   * видит в этом радиусе. Чтобы проверить, с каким радиусом задача спрашивает видимых NPC, можно
   * передать vi.fn
   */
  withVisibleNpcs(visibleNpcs: VisibleNpcsBuild): this {
    this.visibleNpcs = visibleNpcs;
    return this;
  }

  /** Задаёт время суток в мире: в состояние ляжет ManualTime с этим временем */
  withTime(time: TimeState): this {
    this.time = time;
    return this;
  }

  /** Возвращает собранное состояние */
  build(): NpcState {
    const time = new ManualTime(this.time);

    return {
      self: {
        kind: this.kind,
        actor: {
          position: { ...this.position },
          angle: this.angle,
        },
        inventory: new Inventory(this.inventory),
        psyche: this.psyche(new PsycheBuilder()),
        needs: this.needs(new NeedsBuilder().withTime(this.time)),
        addictions: this.addictions(new AddictionsBuilder().withTime(this.time)),
        memory: new Memory(),
      },
      world: {
        time,
        getVisibleNpcs: this.visibleNpcs,
      },
    };
  }
}
