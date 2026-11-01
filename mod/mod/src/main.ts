import { GtaGame } from '@peetland/gta-sa';
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
import { ConscientiousnessFactory, LuckFactory, PsycheFactory, Trait } from '@peetland/psyche';
import { Random } from '@peetland/random';
import { InMemoryRepository } from '@peetland/repository';
import { Timer } from '@peetland/timings';
import { NpcFactory, PlacesFactory, RootTaskFactory, TaskFactory, World } from '@peetland/world';
import type { NpcContext, NpcState } from '@peetland/world';

import { VK_G, VK_H, VK_J } from 'vkeys';

import { npcs } from './data/npcs';
import { places } from './data/places';
import { startTimers } from './patch-global';

/** Можно ли сейчас что-то делать в игре: она загружена, игрок управляет персонажем и не на паузе */
function isGameRunning(): boolean {
  return isPlayerPlaying(PLAYER_HANDLE) && !isGamePaused();
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
      const game = new GtaGame();
      const { actorFactory, frames, geometry } = game;
      const psycheFactory = new PsycheFactory({
        traitFactories: {
          [Trait.Conscientiousness]: new ConscientiousnessFactory(),
          [Trait.Luck]: new LuckFactory(),
        },
      });

      new World({
        npcs: new InMemoryRepository(npcs),
        places: new InMemoryRepository(places),
        placesFactory: new PlacesFactory({ geometry }),
        npcFactory: new NpcFactory({
          actorFactory,
          htnFactory: new HTNFactory<NpcState, NpcContext>(),
          frames,
          inventoryFactory: new InventoryFactory(),
          psycheFactory,
          rootTaskFactory: new RootTaskFactory({
            taskFactory: new TaskFactory({
              geometry,
              psycheFactory,
              random: new Random(),
              timer: new Timer(),
            }),
          }),
        }),
      })
        .bigBang()
        .catch((error: unknown) => reportError(error));
    }

    if (wasKeyPressed(VK_J)) {
      // Рядом со входом в бомжарню, у которого спавнится бомж
      setCharCoordinates(PLAYER_PED, 1267.41, 177.76, 19.44);
    }
  }
}

// @ts-expect-error -- так того требует moonloader
globalThis.main = main;
