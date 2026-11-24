import { Inventory } from '@peetland/inventory';
import { createMockedPsyche } from '@peetland/psyche/dev';
import { ManualTime } from '@peetland/timings';
import { createActor } from '@peetland/virtual-actor/dev';
import { describe, expect, it } from 'vitest';

import { createMockedNpcWorldKnowledge, createNpcData, createNpcDeps } from '../dev';
import { Npc, NpcKind } from '../src';

describe('Npc', () => {
  describe('#getState', () => {
    it('Возвращает тип NPC из данных', () => {
      const data = createNpcData({ kind: NpcKind.Homeless });
      const npc = new Npc(data, createNpcDeps());

      expect(npc.getState().self.kind).toBe(NpcKind.Homeless);
    });

    it('Возвращает инвентарь NPC', () => {
      const inventory = new Inventory();
      const data = createNpcData();
      const npc = new Npc(data, createNpcDeps({ inventory }));

      expect(npc.getState().self.inventory).toBe(inventory);
    });

    it('Возвращает позицию актора', () => {
      const actor = createActor({
        position: {
          x: 1,
          y: 2,
          z: 3,
        },
      });
      const data = createNpcData();
      const npc = new Npc(data, createNpcDeps({ actor }));

      expect(npc.getState().self.actor.position).toStrictEqual(actor.getPosition());
    });

    it('Возвращает угол актора', () => {
      const actor = createActor({ angle: 90 });
      const data = createNpcData();
      const npc = new Npc(data, createNpcDeps({ actor }));

      expect(npc.getState().self.actor.angle).toBe(actor.getAngle());
    });

    it('Возвращает слепок актора, который не меняется, когда актор двигается', () => {
      const actor = createActor({
        position: {
          x: 0,
          y: 0,
          z: 0,
        },
      });
      const data = createNpcData();
      const npc = new Npc(data, createNpcDeps({ actor }));
      const state = npc.getState();

      actor.setPosition({
        x: 5,
        y: 5,
        z: 5,
      });

      expect(state.self.actor.position).toStrictEqual({
        x: 0,
        y: 0,
        z: 0,
      });
    });

    it('Возвращает психику NPC', () => {
      const psyche = createMockedPsyche();
      const data = createNpcData();
      const npc = new Npc(data, createNpcDeps({ psyche }));

      expect(npc.getState().self.psyche).toBe(psyche);
    });

    it('Возвращает состояние мира, которое вернуло знание о мире', () => {
      const world = { time: new ManualTime() };
      const worldKnowledge = createMockedNpcWorldKnowledge(world);
      const data = createNpcData();
      const npc = new Npc(data, createNpcDeps({ worldKnowledge }));

      expect(npc.getState().world).toBe(world);
    });
  });
});
