import { describe, expect, it } from 'vitest';

import { VirtualObjectFactory } from '../src';

describe('VirtualObjectFactory', () => {
  describe('#create', () => {
    it('Создаёт объект на переданной позиции', () => {
      const factory = new VirtualObjectFactory();

      const object = factory.create({
        modelId: 1333,
        position: {
          x: 1,
          y: 2,
          z: 3,
        },
      });

      expect(object.getPosition()).toStrictEqual({
        x: 1,
        y: 2,
        z: 3,
      });
    });
  });
});

describe('VirtualObject', () => {
  describe('#setPosition', () => {
    it('Меняет позицию объекта', () => {
      const factory = new VirtualObjectFactory();
      const object = factory.create({
        modelId: 1333,
        position: {
          x: 1,
          y: 2,
          z: 3,
        },
      });

      object.setPosition({
        x: 4,
        y: 5,
        z: 6,
      });

      expect(object.getPosition()).toStrictEqual({
        x: 4,
        y: 5,
        z: 6,
      });
    });
  });
});
