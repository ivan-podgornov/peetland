import { createNpcContext, NpcStateBuilder } from '@peetland/npc/dev';
import { Feeling } from '@peetland/psyche';
import { createMockedRandom } from '@peetland/random/dev';
import { ManualTimer } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { TryLuckTask } from '../../../src/try-luck-task';

describe('TryLuckTask', () => {
  describe('#update', () => {
    it("Если не повезло, а условие остановки выполнилось, возвращает 'failed'", () => {
      const timer = new ManualTimer();
      const task = new TryLuckTask(
        {
          chance: 1 / 60,
          stopWhen: (state) => state.self.psyche.feelings[Feeling.Shame] >= 80,
        },
        {
          random: createMockedRandom(false),
          timer,
        }
      );
      const context = createNpcContext();
      task.start(NpcStateBuilder.default(), context);

      timer.advance(TryLuckTask.PERIOD);
      const result = task.update(
        new NpcStateBuilder().withFeeling(Feeling.Shame, 80).build(),
        context
      );

      expect(result).toBe('failed');
    });

    it('Если выполнилось условие остановки, больше не бросает шанс', () => {
      const random = createMockedRandom(false);
      const timer = new ManualTimer();
      const task = new TryLuckTask(
        {
          chance: 1 / 60,
          stopWhen: () => true,
        },
        {
          random,
          timer,
        }
      );
      const context = createNpcContext();
      task.start(NpcStateBuilder.default(), context);

      task.update(NpcStateBuilder.default(), context);
      timer.advance(TryLuckTask.PERIOD);

      expect(random.chance).not.toHaveBeenCalled();
    });

    it("Если повезло, а условие остановки выполнилось, возвращает 'success'", () => {
      const timer = new ManualTimer();
      const task = new TryLuckTask(
        {
          chance: 1 / 60,
          stopWhen: () => true,
        },
        {
          random: createMockedRandom(true),
          timer,
        }
      );
      const context = createNpcContext();
      task.start(NpcStateBuilder.default(), context);

      timer.advance(TryLuckTask.PERIOD);
      const result = task.update(NpcStateBuilder.default(), context);

      expect(result).toBe('success');
    });
  });
});
