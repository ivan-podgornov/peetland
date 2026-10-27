import { Observable } from '@peetland/events';
import { describe, expect, it, vi } from 'vitest';

import { DespawnableActor } from '../../src';
import type { IActorCommand } from '../../src';

import { createActorMock } from './helpers';

describe('DespawnableActor', () => {
  describe('До деспавна', () => {
    it('currentCommand возвращает текущую команду обёрнутого актора', () => {
      const command: IActorCommand = { start: vi.fn(), stop: vi.fn(), cancel: vi.fn() };
      const inner = { ...createActorMock(), currentCommand: command };
      const actor = new DespawnableActor(inner);

      expect(actor.currentCommand).toBe(command);
    });

    it('getPosition возвращает позицию обёрнутого актора', () => {
      const inner = createActorMock();
      inner.getPosition.mockReturnValue({ x: 1, y: 2, z: 3 });
      const actor = new DespawnableActor(inner);

      const position = actor.getPosition();

      expect(position).toStrictEqual({ x: 1, y: 2, z: 3 });
    });

    it('setPosition вызывает setPosition обёрнутого актора с той же позицией', () => {
      const inner = createActorMock();
      const actor = new DespawnableActor(inner);

      actor.setPosition({ x: 1, y: 2, z: 3 });

      expect(inner.setPosition).toHaveBeenCalledExactlyOnceWith({ x: 1, y: 2, z: 3 });
    });

    it('goToCoords вызывает goToCoords обёрнутого актора с теми же параметрами', () => {
      const inner = createActorMock();
      const actor = new DespawnableActor(inner);

      actor.goToCoords({ x: 1, y: 2, z: 3 }, 5);

      expect(inner.goToCoords).toHaveBeenCalledExactlyOnceWith({ x: 1, y: 2, z: 3 }, 5);
    });

    it('goToCoords возвращает Observable обёрнутого актора', () => {
      const inner = createActorMock();
      const observable = new Observable<{ x: number; y: number; z: number }>(() => {});
      inner.goToCoords.mockReturnValue(observable);
      const actor = new DespawnableActor(inner);

      const result = actor.goToCoords({ x: 1, y: 2, z: 3 }, 5);

      expect(result).toBe(observable);
    });

    it('despawn вызывает despawn обёрнутого актора', () => {
      const inner = createActorMock();
      const actor = new DespawnableActor(inner);

      actor.despawn();

      expect(inner.despawn).toHaveBeenCalledOnce();
    });
  });
});
