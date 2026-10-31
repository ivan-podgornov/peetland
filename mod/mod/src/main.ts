import './patch-global';

import { GtaGame } from '@peetland/gta-sa';
import {
  getCharCoordinates,
  getCharHeading,
  print,
  wait,
  wasKeyPressed,
  PLAYER_PED,
  setCharCoordinates,
  setCharHeading,
} from '@peetland/moonloader';
import { World } from '@peetland/world';

import { VK_G, VK_H, VK_J } from 'vkeys';

function main() {
  while (true) {
    wait(40);

    if (wasKeyPressed(VK_G)) {
      const [x, y, z] = getCharCoordinates(PLAYER_PED);
      const angle = getCharHeading(PLAYER_PED);
      print(`x: ${x}, y: ${y}, z: ${z}, angle: ${angle}`);
    }

    if (wasKeyPressed(VK_H)) {
      new World({ game: new GtaGame() }).bigBang();
    }

    if (wasKeyPressed(VK_J)) {
      setCharCoordinates(PLAYER_PED, 2269.6, 65.66, 26.48);
      setCharHeading(PLAYER_PED, 0);
    }
  }
}

// @ts-expect-error -- так того требует moonloader
globalThis.main = main;
