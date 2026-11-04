import type { ILogger } from '@peetland/logger';
import { print } from '@peetland/moonloader';

/** Пишет лог в moonloader.log через print, помечая каждое сообщение уровнем */
export class GtaLogger implements ILogger {
  info(message: string): void {
    print(`[info] ${message}`);
  }

  warn(message: string): void {
    print(`[warn] ${message}`);
  }

  error(message: string): void {
    print(`[error] ${message}`);
  }
}
