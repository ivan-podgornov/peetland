import { GtaGame } from '@peetland/gta-sa';
import {
  getCharCoordinates,
  getCharHeading,
  isGamePaused,
  isPlayerPlaying,
  print,
  wait,
  wasKeyPressed,
  PLAYER_HANDLE,
  PLAYER_PED,
  setCharCoordinates,
} from '@peetland/moonloader';
import { InMemoryRepository } from '@peetland/repository';
import { World } from '@peetland/world';

import { VK_G, VK_H, VK_J } from 'vkeys';

import { npcs } from './data/npcs';
import { places } from './data/places';
import { startTimers } from './patch-global';

/** Можно ли сейчас что-то делать в игре: она загружена, игрок управляет персонажем и не на паузе */
function isGameRunning(): boolean {
  return isPlayerPlaying(PLAYER_HANDLE) && !isGamePaused();
}

function main() {
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
      new World({
        game: new GtaGame(),
        npcs: new InMemoryRepository(npcs),
        places: new InMemoryRepository(places),
      })
        .bigBang()
        .catch((error: unknown) => reportError(error));
    }

    if (wasKeyPressed(VK_J)) {
      // К трейлеру, у которого спавнится бомж
      setCharCoordinates(PLAYER_PED, 1295.13, 135.64, 20.4);
    }
  }
}

// @ts-expect-error -- так того требует moonloader
globalThis.main = main;
