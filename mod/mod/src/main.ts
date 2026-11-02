import { GtaGame } from '@peetland/gta-sa';
import { HomelessRootTaskFactory, HomelessTaskFactory } from '@peetland/homeless';
import { HTNFactory } from '@peetland/htn';
import { InventoryFactory } from '@peetland/inventory';
import {
  getCharCoordinates,
  getCharHeading,
  isGamePaused,
  isPlayerPlaying,
  math,
  os,
  print,
  wait,
  wasKeyPressed,
  PLAYER_HANDLE,
  PLAYER_PED,
  setCharCoordinates,
} from '@peetland/moonloader';
import { NpcFactory } from '@peetland/npc';
import type { NpcContext, NpcState } from '@peetland/npc';
import { NpcTaskFactory } from '@peetland/npc-tasks';
import { PlacesFactory } from '@peetland/places';
import { ConscientiousnessFactory, LuckFactory, PsycheFactory, Trait } from '@peetland/psyche';
import { Random } from '@peetland/random';
import { InMemoryRepository } from '@peetland/repository';
import { Timer } from '@peetland/timings';
import { World } from '@peetland/world';

import { VK_G, VK_H, VK_J } from 'vkeys';

import { npcs } from './data/npcs';
import { places } from './data/places';
import { startTimers } from './patch-global';

/** Можно ли сейчас что-то делать в игре: она загружена, игрок управляет персонажем и не на паузе */
function isGameRunning(): boolean {
  return isPlayerPlaying(PLAYER_HANDLE) && !isGamePaused();
}

/** Загружает места мира, собирает зависимости и запускает жизнь в мире */
async function bigBang(): Promise<void> {
  const game = new GtaGame();
  const { actorFactory, frames, geometry } = game;
  const random = new Random();
  const psycheFactory = new PsycheFactory({
    traitFactories: {
      [Trait.Conscientiousness]: new ConscientiousnessFactory(),
      [Trait.Luck]: new LuckFactory(),
    },
  });
  const worldPlaces = new PlacesFactory({ geometry }).create({
    places: await new InMemoryRepository(places).getAll(),
  });

  await new World({
    npcs: new InMemoryRepository(npcs),
    npcFactory: new NpcFactory({
      actorFactory,
      htnFactory: new HTNFactory<NpcState, NpcContext>(),
      frames,
      inventoryFactory: new InventoryFactory(),
      psycheFactory,
      rootTaskFactory: new HomelessRootTaskFactory({
        homelessTaskFactory: new HomelessTaskFactory({
          npcTaskFactory: new NpcTaskFactory({
            geometry,
            psycheFactory,
            random,
            timer: new Timer(),
          }),
          places: worldPlaces,
          psycheFactory,
          random,
        }),
      }),
    }),
  }).bigBang();
}

function main() {
  // Без начального значения math.random при каждом запуске игры выдаёт одну и ту же
  // последовательность, и шансы NPC выпадают одинаково
  math.randomseed(os.time());

  // До загрузки игры (заставки, меню) скрипт ничего не трогает
  while (!isPlayerPlaying(PLAYER_HANDLE)) {
    wait(100);
  }

  startTimers(isGameRunning);

  while (true) {
    wait(40);

    if (!isGameRunning()) {
      continue;
    }

    if (wasKeyPressed(VK_G)) {
      const [x, y, z] = getCharCoordinates(PLAYER_PED);
      const angle = getCharHeading(PLAYER_PED);
      print(`x: ${x}, y: ${y}, z: ${z}, angle: ${angle}`);
    }

    if (wasKeyPressed(VK_H)) {
      bigBang().catch((error: unknown) => reportError(error));
    }

    if (wasKeyPressed(VK_J)) {
      // Рядом со входом в бомжарню, у которого спавнится бомж
      setCharCoordinates(PLAYER_PED, 1267.41, 177.76, 19.44);
    }
  }
}

// @ts-expect-error -- так того требует moonloader
globalThis.main = main;
