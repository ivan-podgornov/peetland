import { createActor, createMockedActorFactory } from '@peetland/virtual-actor/dev';
import { describe, expect, it } from 'vitest';

import { Npc } from '../../src';

import { createNpcData, createNpcDeps } from './helpers';

describe('Npc', () => {
  describe('#getState', () => {
    it('Возвращает живой инвентарь NPC, а не копию', () => {
      const npc = new Npc(createNpcData(), createNpcDeps());

      expect(npc.getState().inventory).toBe(npc.inventory);
    });

    it('Возвращает позицию актора', () => {
      const actor = createActor({ position: { x: 1, y: 2, z: 3 } });
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({ actorFactory: createMockedActorFactory(actor) })
      );

      expect(npc.getState().actor.position).toStrictEqual(actor.getPosition());
    });

    it('Возвращает угол актора', () => {
      const actor = createActor({ angle: 90 });
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({ actorFactory: createMockedActorFactory(actor) })
      );

      expect(npc.getState().actor.angle).toBe(actor.getAngle());
    });

    it('Возвращает слепок актора, который не меняется, когда актор двигается', () => {
      const actor = createActor({ position: { x: 0, y: 0, z: 0 } });
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({ actorFactory: createMockedActorFactory(actor) })
      );
      const state = npc.getState();

      actor.setPosition({ x: 5, y: 5, z: 5 });

      expect(state.actor.position).toStrictEqual({ x: 0, y: 0, z: 0 });
    });

    it('Возвращает черты характера NPC', () => {
      const npc = new Npc(createNpcData({ traits: { conscientiousness: 80 } }), createNpcDeps());

      expect(npc.getState().traits).toStrictEqual({ conscientiousness: 80 });
    });

    it('Возвращает чувства NPC', () => {
      const npc = new Npc(createNpcData({ feelings: { shame: 30 } }), createNpcDeps());

      expect(npc.getState().feelings).toStrictEqual({ shame: 30 });
    });
  });
});
