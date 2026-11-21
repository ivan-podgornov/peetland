import type { IActor } from './types';

/**
 * Реестр заспавненных акторов игры. Фабрики акторов регистрируют в нём каждого созданного актора,
 * а реестр следит за сигналом деспавна: как только актор деспавнен, он сам исчезает из реестра,
 * поэтому в нём не бывает «призраков» — деспавненных акторов
 */
export class ActorRegistry {
  private readonly actors: Set<IActor>;
  private readonly removeListeners: Map<IActor, () => void>;

  constructor() {
    this.actors = new Set();
    this.removeListeners = new Map();
  }

  /**
   * Добавляет актора в реестр. Деспавненного актора реестр не принимает: после деспавна актором
   * больше не пользуются, и «призрак» в реестре только мешал бы проверке видимости. Повторная
   * регистрация того же актора ничего не меняет
   */
  register(actor: IActor): void {
    if (actor.signal.aborted || this.actors.has(actor)) {
      return;
    }

    const removeListener = () => this.remove(actor);

    this.actors.add(actor);
    this.removeListeners.set(actor, removeListener);
    actor.signal.addEventListener('abort', removeListener);
  }

  /**
   * Убирает актора из реестра и перестаёт следить за его сигналом деспавна. Обычно актор убирается
   * сам при деспавне, вручную это нужно, чтобы выкинуть актора из реестра до его деспавна
   */
  remove(actor: IActor): void {
    const removeListener = this.removeListeners.get(actor);

    if (removeListener === undefined) {
      return;
    }

    actor.signal.removeEventListener('abort', removeListener);
    this.removeListeners.delete(actor);
    this.actors.delete(actor);
  }

  /** Возвращает всех заспавненных акторов, зарегистрированных в реестре */
  getAll(): IActor[] {
    return [...this.actors];
  }
}
