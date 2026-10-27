import { describe, expect, it } from 'vitest';

import { createActor } from './create-actor';

describe('VirtualActor', () => {
  describe('#getPosition', () => {
    it('Возвращает позицию, на которой создан актор', () => {
      const actor = createActor({ position: { x: 1, y: 2, z: 3 } });

      const position = actor.getPosition();

      expect(position).toStrictEqual({ x: 1, y: 2, z: 3 });
    });

    it('Изменение возвращённой позиции не сдвигает актора', () => {
      const actor = createActor({ position: { x: 1, y: 2, z: 3 } });

      actor.getPosition().x = 100;

      expect(actor.getPosition()).toStrictEqual({ x: 1, y: 2, z: 3 });
    });

    it('Если актор деспавнен, выбрасывает ошибку', () => {
      const actor = createActor();
      actor.despawn();

      expect(() => actor.getPosition()).toThrow(Error);
    });
  });
});
