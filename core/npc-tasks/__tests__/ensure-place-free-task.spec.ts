import { Geometry } from '@peetland/geometry';
import type { Vector3 } from '@peetland/geometry';
import { Memory } from '@peetland/memory';
import { Npc } from '@peetland/npc';
import type { INpc } from '@peetland/npc';
import { createNpcContext, createNpcData, createNpcDeps, NpcStateBuilder } from '@peetland/npc/dev';
import { createActor } from '@peetland/virtual-actor/dev';
import { describe, expect, it, vi } from 'vitest';

import { EnsurePlaceFreeTask } from '../src/ensure-place-free-task';

/** Создаёт NPC, который стоит в position: задача видит его позицию через состояние NPC */
function createStandingNpc(position: Vector3): INpc {
  return new Npc(createNpcData(), createNpcDeps({ actor: createActor({ position }) }));
}

describe('EnsurePlaceFreeTask', () => {
  describe('#start', () => {
    it('Если видимый NPC стоит в радиусе занятости от места, запоминает факт и завершается неудачей', () => {
      const time = {
        day: 2,
        hours: 14,
        minutes: 30,
      };
      const memory = new Memory();
      const context = {
        ...createNpcContext(),
        memory,
      };
      const occupant = createStandingNpc({
        x: 1.5,
        y: 0,
        z: 0,
      });
      const state = new NpcStateBuilder()
        .withPosition(30, 0, 0)
        .withTime(time)
        .withVisibleNpcs(() => [occupant])
        .build();
      const task = new EnsurePlaceFreeTask(
        {
          placeId: 'begging-spot-1',
          position: {
            x: 0,
            y: 0,
            z: 0,
          },
        },
        { geometry: new Geometry() }
      );

      const result = task.start(state, context);

      expect(result).toBe('failed');
      expect(memory.recall('placeTaken')).toStrictEqual([
        {
          type: 'placeTaken',
          details: { placeId: 'begging-spot-1' },
          rememberedAt: time,
        },
      ]);
    });

    it('Если видимый NPC дальше радиуса занятости, проверка проходит и факт не пишется', () => {
      const memory = new Memory();
      const context = {
        ...createNpcContext(),
        memory,
      };
      const bystander = createStandingNpc({
        x: 5,
        y: 0,
        z: 0,
      });
      const state = new NpcStateBuilder()
        .withPosition(30, 0, 0)
        .withVisibleNpcs(() => [bystander])
        .build();
      const task = new EnsurePlaceFreeTask(
        {
          placeId: 'begging-spot-1',
          position: {
            x: 0,
            y: 0,
            z: 0,
          },
        },
        { geometry: new Geometry() }
      );

      const result = task.start(state, context);

      expect(result).toBe('success');
      expect(memory.recall('placeTaken')).toStrictEqual([]);
    });

    it('Спрашивает видимых NPC в радиусе до места плюс радиус занятости', () => {
      const getVisibleNpcs = vi.fn(() => []);
      const state = new NpcStateBuilder()
        .withPosition(30, 0, 0)
        .withVisibleNpcs(getVisibleNpcs)
        .build();
      const task = new EnsurePlaceFreeTask(
        {
          placeId: 'begging-spot-1',
          position: {
            x: 0,
            y: 0,
            z: 0,
          },
        },
        { geometry: new Geometry() }
      );

      task.start(state, createNpcContext());

      // NPC в 30 м от места, радиус занятости — 2: видимых NPC спрашивает в 32 м
      expect(getVisibleNpcs).toHaveBeenCalledExactlyOnceWith(32);
    });
  });

  describe('#applyEffects', () => {
    it('Не меняет состояние', () => {
      const task = new EnsurePlaceFreeTask(
        {
          placeId: 'begging-spot-1',
          position: {
            x: 0,
            y: 0,
            z: 0,
          },
        },
        { geometry: new Geometry() }
      );
      const before = NpcStateBuilder.default();

      const after = task.applyEffects(before);

      expect(after).toEqual(before);
    });
  });
});
