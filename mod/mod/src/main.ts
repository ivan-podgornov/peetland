import { GtaGame } from '@peetland/gta-sa';
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
import { InMemoryRepository } from '@peetland/repository';
import { World } from '@peetland/world';

import { VK_G, VK_H, VK_J, VK_L } from 'vkeys';

import { npcs } from './data/npcs';
import { places } from './data/places';
import { startTimers } from './patch-global';

/** Можно ли сейчас что-то делать в игре: она загружена, игрок управляет персонажем и не на паузе */
function isGameRunning(): boolean {
  return isPlayerPlaying(PLAYER_HANDLE) && !isGamePaused();
}

/**
 * Создаёт мир в игре с местами и NPC из данных мода и запускает в нём жизнь
 * @param game - игра, в которой создаётся мир
 */
async function bigBang(game: GtaGame): Promise<void> {
  await new World({
    game,
    places: new InMemoryRepository(places),
    npcs: new InMemoryRepository(npcs),
  }).bigBang();
}

/** Заспавнен ли пед для проверки застревания */
let stuckPedSpawned = false;

/**
 * Отладка застревания (issue #106). Спавнит педа у мусорки за торговым центром и отправляет к
 * киоску, где сдают бутылки: этот путь пед сам не проходит и застревает. Пед спавнится один раз
 */
function debugStuckPed(): void {
  if (stuckPedSpawned) {
    return;
  }

  const game = new GtaGame();
  // Мусорка montgomery-trash-bin-4
  const actor = game.actorFactory.create({
    modelId: 230,
    position: {
      x: 1320.22,
      y: 210.51,
      z: 19.55,
    },
    angle: 339,
  });
  game.signal.addEventListener('abort', () => actor.despawn(), { once: true });
  stuckPedSpawned = true;

  // Киоск montgomery-hannibal-liquor-kiosk-backdoor
  actor
    .goToCoords(
      {
        x: 1311.13,
        y: 351.59,
        z: 19.55,
      },
      1
    )
    .execute()
    .subscribe({
      complete: () => print('stuck ped: arrived'),
      error: (error: unknown) => reportError(error),
    });
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
      bigBang(new GtaGame()).catch((error: unknown) => reportError(error));
    }

    if (wasKeyPressed(VK_J)) {
      // Рядом со входом в бомжарню, у которого спавнится бомж
      setCharCoordinates(PLAYER_PED, 1267.41, 177.76, 19.44);
    }

    if (wasKeyPressed(VK_L)) {
      debugStuckPed();
    }
  }
}

// @ts-expect-error -- так того требует moonloader
globalThis.main = main;
