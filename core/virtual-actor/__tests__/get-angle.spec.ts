import { describe, expect, it } from 'vitest';

import { createActor } from '../dev';

describe('VirtualActor', () => {
  describe('#getAngle', () => {
    it('Возвращает угол, на который актор повёрнут при создании', () => {
      const actor = createActor({ angle: 90 });

      const angle = actor.getAngle();

      expect(angle).toBe(90);
    });

    it('Если актор переместился, угол не меняется', () => {
      const actor = createActor({ angle: 90 });

      actor.setPosition({ x: 10, y: 20, z: 0 });

      expect(actor.getAngle()).toBe(90);
    });
  });
});
