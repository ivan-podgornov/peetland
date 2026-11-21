import type { IActor, IActorRegistry } from './types';

export class ActorRegistry implements IActorRegistry {
  private readonly actors: Set<IActor>;
  private readonly removeListeners: Map<IActor, () => void>;

  constructor() {
    this.actors = new Set();
    this.removeListeners = new Map();
  }

  register(actor: IActor): void {
    if (actor.signal.aborted || this.actors.has(actor)) {
      return;
    }

    const removeListener = () => this.remove(actor);

    this.actors.add(actor);
    this.removeListeners.set(actor, removeListener);
    actor.signal.addEventListener('abort', removeListener);
  }

  remove(actor: IActor): void {
    const removeListener = this.removeListeners.get(actor);

    if (!removeListener) {
      return;
    }

    actor.signal.removeEventListener('abort', removeListener);
    this.removeListeners.delete(actor);
    this.actors.delete(actor);
  }

  getAll(): IActor[] {
    return [...this.actors];
  }
}
