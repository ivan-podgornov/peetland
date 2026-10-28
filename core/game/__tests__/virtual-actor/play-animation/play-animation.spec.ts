import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import type { VirtualAnimations } from '../../../src';
import { ANIMATION_DURATION, createActor, createAnimations } from '../../helpers';

describe('VirtualActor', () => {
  describe('#playAnimation', () => {
    it('Завершает Observable, когда проходит длительность анимации из таблицы', () => {
      const timer = new ManualTimer();
      const animations = { ...createAnimations(), pay: { duration: 4670 } };
      const actor = createActor({ timer, animations });
      const complete = vi.fn();
      actor.playAnimation('pay').subscribe({ complete });

      timer.advance(4670);

      expect(complete).toHaveBeenCalledOnce();
    });

    it('Не завершает Observable, пока длительность анимации из таблицы не прошла', () => {
      const timer = new ManualTimer();
      const animations = { ...createAnimations(), pay: { duration: 4670 } };
      const actor = createActor({ timer, animations });
      const complete = vi.fn();
      actor.playAnimation('pay').subscribe({ complete });

      timer.advance(4669);

      expect(complete).not.toHaveBeenCalled();
    });

    it('Если анимации нет в таблице, выбрасывает ошибку', () => {
      const animations = createAnimations() as Partial<VirtualAnimations>;
      delete animations.pay;
      const actor = createActor({ animations: animations as VirtualAnimations });

      expect(() => actor.playAnimation('pay')).toThrow(Error);
    });

    it('Если для анимации не задана длительность, выбрасывает ошибку', () => {
      const animations = { ...createAnimations(), pay: {} } as VirtualAnimations;
      const actor = createActor({ animations });

      expect(() => actor.playAnimation('pay')).toThrow(Error);
    });

    it('Не сообщает значений', () => {
      const timer = new ManualTimer();
      const actor = createActor({ timer });
      const next = vi.fn();
      actor.playAnimation('pay').subscribe({ next });

      timer.advance(ANIMATION_DURATION);

      expect(next).not.toHaveBeenCalled();
    });

    it('Не меняет текущую команду до подписки', () => {
      const actor = createActor();

      actor.playAnimation('pay');

      expect(actor.currentCommand).toBeNull();
    });

    it('При подписке делает проигрывание анимации текущей командой', () => {
      const actor = createActor();

      actor.playAnimation('pay').subscribe();

      expect(actor.currentCommand?.name).toBe('play-animation');
    });

    it('Сбрасывает текущую команду, когда анимация закончилась', () => {
      const timer = new ManualTimer();
      const actor = createActor({ timer });
      actor.playAnimation('pay').subscribe();

      timer.advance(ANIMATION_DURATION);

      expect(actor.currentCommand).toBeNull();
    });
  });
});
