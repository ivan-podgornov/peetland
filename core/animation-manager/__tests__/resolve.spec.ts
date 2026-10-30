import { describe, expect, it } from 'vitest';

import { AnimationManager } from '../src';
import type { AnimationTable } from '../src';

import { createTestAnimationManager, createManualLoader, TEST_ANIMATIONS } from './helpers';
import type { TestAnimation } from './helpers';

describe('AnimationManager', () => {
  describe('#resolve', () => {
    it('Возвращает запись из таблицы анимаций', () => {
      const manager = createTestAnimationManager();

      const playback = manager.resolve('pay');

      expect(playback.animation).toStrictEqual(TEST_ANIMATIONS.pay);
    });

    it('Если время проигрывания не передано, возвращает длительность из таблицы', () => {
      const manager = createTestAnimationManager();

      const playback = manager.resolve('trash-search');

      expect(playback.duration).toBe(TEST_ANIMATIONS['trash-search'].duration);
    });

    it('Если время проигрывания передано, возвращает его', () => {
      const manager = createTestAnimationManager();

      const playback = manager.resolve('trash-search', 5000);

      expect(playback.duration).toBe(5000);
    });

    it('Для зацикленной анимации возвращает loop', () => {
      const manager = createTestAnimationManager();

      const playback = manager.resolve('trash-search');

      expect(playback.loop).toBe(true);
    });

    it('Для незацикленной анимации не возвращает loop', () => {
      const manager = createTestAnimationManager();

      const playback = manager.resolve('pay');

      expect(playback.loop).toBe(false);
    });

    it('Если время проигрывания передано для незацикленной анимации, выбрасывает ошибку', () => {
      const manager = createTestAnimationManager();

      expect(() => manager.resolve('pay', 5000)).toThrow(Error);
    });

    it('Если время проигрывания равно нулю, выбрасывает RangeError', () => {
      const manager = createTestAnimationManager();

      expect(() => manager.resolve('trash-search', 0)).toThrow(RangeError);
    });

    it('Если время проигрывания бесконечно, выбрасывает RangeError', () => {
      const manager = createTestAnimationManager();

      expect(() => manager.resolve('trash-search', Infinity)).toThrow(RangeError);
    });

    it('Если анимации нет в таблице, выбрасывает ошибку', () => {
      const animations: Partial<AnimationTable<TestAnimation>> = { ...TEST_ANIMATIONS };
      delete animations.pay;
      const manager = new AnimationManager(
        { animations: animations as AnimationTable<TestAnimation> },
        { loader: createManualLoader() }
      );

      expect(() => manager.resolve('pay')).toThrow(Error);
    });

    it('Если для анимации не задана длительность, выбрасывает ошибку', () => {
      const animations = {
        ...TEST_ANIMATIONS,
        pay: { group: 'money' },
      } as AnimationTable<TestAnimation>;
      const manager = new AnimationManager({ animations }, { loader: createManualLoader() });

      expect(() => manager.resolve('pay')).toThrow(Error);
    });
  });
});
