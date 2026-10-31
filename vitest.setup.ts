import { afterEach, vi } from 'vitest';

// В Node нет глобального reportError, а код пакетов сообщает через него об ошибках, которые некому
// обработать. В тестах это мок: проверить, что ошибка сообщена, можно через
// expect(reportError).toHaveBeenCalledWith(error)
globalThis.reportError = vi.fn();

afterEach(() => {
  vi.mocked(reportError).mockClear();
});
