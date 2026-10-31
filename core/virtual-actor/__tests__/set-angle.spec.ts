import { describe, expect, it } from 'vitest';

import { createActor } from '../dev';

describe('VirtualActor', () => {
  describe('#setAngle', () => {
    it('Поворачивает актора на переданный угол', () => {
      const actor = createActor({ angle: 0 });

      actor.setAngle(90);

      expect(actor.getAngle()).toBe(90);
    });

    it('Приводит переданный угол к диапазону [0, 360)', () => {
      const actor = createActor({ angle: 0 });

      actor.setAngle(-10);

      expect(actor.getAngle()).toBe(350);
    });
  });
});
