import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { VIRTUAL_ANIMATIONS } from '../../../src';
import type { VirtualAnimations } from '../../../src';
import { createActor } from '../../helpers';

describe('VirtualActor', () => {
  describe('#playAnimation', () => {
    it('Завершает Observable, когда проходит длительность анимации из таблицы', () => {
      const timer = new ManualTimer();
      const actor = createActor({ timer, animations: VIRTUAL_ANIMATIONS });
      const complete = vi.fn();
      actor.playAnimation('pay').subscribe({ complete });

      timer.advance(VIRTUAL_ANIMATIONS.pay.duration);

      expect(complete).toHaveBeenCalledOnce();
    });

    it('Не завершает Observable, пока длительность анимации из таблицы не прошла', () => {
      const timer = new ManualTimer();
      const actor = createActor({ timer, animations: VIRTUAL_ANIMATIONS });
      const complete = vi.fn();
      actor.playAnimation('pay').subscribe({ complete });

      timer.advance(VIRTUAL_ANIMATIONS.pay.duration - 1);

      expect(complete).not.toHaveBeenCalled();
    });

    it('Если анимации нет в таблице, выбрасывает ошибку', () => {
      const animations: Partial<VirtualAnimations> = { ...VIRTUAL_ANIMATIONS };
      delete animations.pay;
      const actor = createActor({ animations: animations as VirtualAnimations });

      expect(() => actor.playAnimation('pay')).toThrow(Error);
    });

    it('Если для анимации не задана длительность, выбрасывает ошибку', () => {
      const animations = { ...VIRTUAL_ANIMATIONS, pay: {} } as VirtualAnimations;
      const actor = createActor({ animations });

      expect(() => actor.playAnimation('pay')).toThrow(Error);
    });

    it('Не сообщает значений', () => {
      const timer = new ManualTimer();
      const actor = createActor({ timer });
      const next = vi.fn();
      actor.playAnimation('pay').subscribe({ next });

      timer.advance(VIRTUAL_ANIMATIONS.pay.duration);

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

      expect(actor.currentCommand).toHaveProperty('name', 'play-animation');
    });

    it('Сбрасывает текущую команду, когда анимация закончилась', () => {
      const timer = new ManualTimer();
      const actor = createActor({ timer });
      actor.playAnimation('pay').subscribe();

      timer.advance(VIRTUAL_ANIMATIONS.pay.duration);

      expect(actor.currentCommand).toBeNull();
    });
  });
});
