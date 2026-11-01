import { ManualTimer } from '@peetland/timings';
import { VIRTUAL_ANIMATIONS } from '@peetland/virtual-actor';
import { createActor } from '@peetland/virtual-actor/dev';
import { describe, expect, it, vi } from 'vitest';

import { PlayAnimationTask } from '../../src';

import { createNpcContext, createNpcState } from './helpers';

describe('PlayAnimationTask', () => {
  describe('#start', () => {
    it('Отдаёт актору команду проиграть анимацию', () => {
      const actor = createActor();
      const playAnimation = vi.spyOn(actor, 'playAnimation');
      const task = new PlayAnimationTask({ animation: 'drink-standing-1', duration: 5000 });

      task.start(createNpcState(), createNpcContext(actor));

      expect(playAnimation).toHaveBeenCalledExactlyOnceWith('drink-standing-1', 5000);
    });
  });

  describe('#update', () => {
    it("Возвращает 'success', когда анимация закончилась", () => {
      const timer = new ManualTimer();
      const context = createNpcContext(createActor({ timer }));
      const task = new PlayAnimationTask({ animation: 'pay' });
      task.start(createNpcState(), context);

      timer.advance(VIRTUAL_ANIMATIONS.pay.duration);
      const result = task.update(createNpcState(), context);

      expect(result).toBe('success');
    });
  });

  describe('#applyEffects', () => {
    it('Не меняет состояние', () => {
      const task = new PlayAnimationTask({ animation: 'pay' });
      const before = createNpcState();

      const after = task.applyEffects(before);

      expect(after).toEqual(before);
    });
  });
});
