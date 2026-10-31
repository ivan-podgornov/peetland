import type { NpcData } from '@peetland/world';

export const npcs: NpcData[] = [
  {
    id: 'peet',
    modelId: 230,
    // Самый маленький трейлер
    spawnPosition: { x: 1299.13, y: 140.64, z: 20.4 },
    spawnAngle: 179,
    traits: {
      conscientiousness: 100,
    },
    feelings: {
      shame: 0,
    },
    inventory: {},
  },
];
