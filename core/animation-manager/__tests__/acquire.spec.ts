import { AbortController } from '@peetland/events';
import { describe, expect, it, vi } from 'vitest';

import { InstantAnimationLoader } from '../src';

import { createAnimationManager, ManualAnimationLoader } from './helpers';

describe('AnimationManager', () => {
  describe('#acquire', () => {
    it('До подписки не загружает анимацию', () => {
      const loader = new ManualAnimationLoader();
      const manager = createAnimationManager(loader);

      manager.acquire('pay');

      expect(loader.loads).toBe(0);
    });

    it('При подписке загружает анимацию', () => {
      const loader = new ManualAnimationLoader();
      const manager = createAnimationManager(loader);

      manager.acquire('pay').subscribe();

      expect(loader.loads).toBe(1);
    });

    it('Пока анимация загружается, значение не сообщает', () => {
      const manager = createAnimationManager();
      const next = vi.fn();

      manager.acquire('pay').subscribe({ next });

      expect(next).not.toHaveBeenCalled();
    });

    it('Сообщает значение, когда анимация загружена', () => {
      const loader = new ManualAnimationLoader();
      const manager = createAnimationManager(loader);
      const next = vi.fn();
      manager.acquire('pay').subscribe({ next });

      loader.finish('money');

      expect(next).toHaveBeenCalledOnce();
    });

    it('Если анимация уже загружена, сообщает значение сразу при подписке', () => {
      const loader = new ManualAnimationLoader();
      const manager = createAnimationManager(loader);
      const next = vi.fn();
      manager.acquire('pay').subscribe();
      loader.finish('money');

      manager.acquire('pay').subscribe({ next });

      expect(next).toHaveBeenCalledOnce();
    });

    it('Если загрузчик загружает сразу, сообщает значение один раз', () => {
      const manager = createAnimationManager(new InstantAnimationLoader());
      const next = vi.fn();

      manager.acquire('pay').subscribe({ next });

      expect(next).toHaveBeenCalledOnce();
    });

    it('Анимации с одним ключом загрузки загружает одной загрузкой', () => {
      const loader = new ManualAnimationLoader();
      const manager = createAnimationManager(loader);
      manager.acquire('pay').subscribe();

      manager.acquire('item-give').subscribe();

      expect(loader.loads).toBe(1);
    });

    it('Анимации с разными ключами загрузки загружает отдельно', () => {
      const loader = new ManualAnimationLoader();
      const manager = createAnimationManager(loader);
      manager.acquire('pay').subscribe();

      manager.acquire('trash-search').subscribe();

      expect(loader.loads).toBe(2);
    });

    it('Пока на анимацию подписан хоть кто-то, не выгружает её', () => {
      const loader = new ManualAnimationLoader();
      const manager = createAnimationManager(loader);
      const controller = new AbortController();
      manager.acquire('pay').subscribe({}, { signal: controller.signal });
      manager.acquire('item-give').subscribe();

      controller.abort();

      expect(loader.unloads).toBe(0);
    });

    it('Когда отписался последний, выгружает анимацию', () => {
      const loader = new ManualAnimationLoader();
      const manager = createAnimationManager(loader);
      const first = new AbortController();
      const second = new AbortController();
      manager.acquire('pay').subscribe({}, { signal: first.signal });
      manager.acquire('item-give').subscribe({}, { signal: second.signal });

      first.abort();
      second.abort();

      expect(loader.unloads).toBe(1);
    });

    it('После выгрузки новая подписка загружает анимацию заново', () => {
      const loader = new ManualAnimationLoader();
      const manager = createAnimationManager(loader);
      const controller = new AbortController();
      manager.acquire('pay').subscribe({}, { signal: controller.signal });
      loader.finish('money');
      controller.abort();

      manager.acquire('pay').subscribe();

      expect(loader.loads).toBe(2);
    });

    it('После выгрузки новая подписка не сообщает значение, пока анимация не загрузится', () => {
      const loader = new ManualAnimationLoader();
      const manager = createAnimationManager(loader);
      const controller = new AbortController();
      const next = vi.fn();
      manager.acquire('pay').subscribe({}, { signal: controller.signal });
      loader.finish('money');
      controller.abort();

      manager.acquire('pay').subscribe({ next });

      expect(next).not.toHaveBeenCalled();
    });

    it('Если анимации нет в таблице, выбрасывает ошибку', () => {
      const manager = createAnimationManager();
      const animation = 'unknown' as 'pay';

      expect(() => manager.acquire(animation)).toThrow(Error);
    });
  });
});
