---
title: Проверка в игре
---

# Проверка в игре

Мод проверяется на компьютере с GTA San Andreas и MoonLoader. Собирать проект на нём не нужно:
сборки публикуются на GitHub Pages, а скрипт-загрузчик скачивает их прямо в игре.

## Сборки

Сборка мода ветки публикуется на GitHub Pages: `main` — при мерже, ветка пулл реквеста — при каждом
пуше (см. [CI и сборки](./ci.md)). Адрес сборки —
`<адрес GitHub Pages репозитория>/<ветка>/mod/peetland.lua`, а ссылка на сборку ветки есть в пулл
реквесте, в окружении `mod`.

## Загрузчик

Скрипт ниже нужно один раз сохранить как `moonloader/peetland-loader.lua` на компьютере, где
проверяется мод. По нажатию **Ctrl + T** он скачивает сборку, выгружает запущенную версию мода
и запускает новую. Если скачать сборку не удалось, старая версия продолжает работать. При старте
игры загрузчик сам запускает сборку, скачанную в прошлый раз.

Какую сборку загружать, определяет переменная `BRANCH` в начале скрипта: `main` или ветка пулл
реквеста, например `feat/npc`. Адрес GitHub Pages репозитория задаёт переменная `SITE`.

Сборка сохраняется в `moonloader/peetland/peetland.lua`. В корне `moonloader` не должно быть своего
`peetland.lua`, иначе запустятся два экземпляра мода. Ошибки загрузки пишутся в `moonloader.log`.

```lua
script_name('peetland-loader')
script_author('ivan-podgornov')

local vkeys = require('vkeys')
local dlstatus = require('moonloader').download_status

-- Ветка, сборку которой нужно загружать, например 'main' или 'feat/npc'
local BRANCH = 'main'

-- Адрес GitHub Pages репозитория
local SITE = 'https://ivan-podgornov.github.io/peetland'
local URL = SITE .. '/' .. BRANCH .. '/mod/peetland.lua'

-- Подпапка, а не корень moonloader: иначе peetland.lua будет сам запускаться при старте игры
local DIR = getWorkingDirectory() .. '\\peetland'
local TARGET = DIR .. '\\peetland.lua'
local TEMP = DIR .. '\\peetland.download.lua'
local TIMEOUT_SECONDS = 30

-- Запущенный экземпляр peetland
local peetland = nil

local function notify(text)
  print(text)
  printStringNow(text, 3000)
end

local function download()
  os.remove(TEMP)

  local finished = false
  -- Параметр ломает кэш Windows: без него можно получить старую сборку
  downloadUrlToFile(URL .. '?t=' .. os.time(), TEMP, function(_, status)
    if status == dlstatus.STATUS_ENDDOWNLOADDATA then
      finished = true
    end
  end)

  local startedAt = localClock()
  while not finished do
    if localClock() - startedAt > TIMEOUT_SECONDS then
      return false, 'timeout'
    end
    wait(0)
  end

  -- Компилируем без запуска: так отсекаем недокачанный файл или html-страницу с ошибкой
  local chunk, err = loadfile(TEMP)
  if not chunk then
    return false, err
  end

  return true
end

local function unloadpeetland()
  if peetland then
    pcall(function()
      peetland:unload()
    end)
    peetland = nil
    wait(0)
  end
end

local function reload()
  notify('peetland: downloading...')

  local ok, err = download()
  if not ok then
    notify('peetland: download failed')
    print(err)
    return
  end

  -- Старая версия выгружается только после успешной загрузки новой
  unloadpeetland()
  os.remove(TARGET)
  os.rename(TEMP, TARGET)

  peetland = script.load(TARGET)
  if peetland then
    notify('peetland: loaded')
  else
    notify('peetland: failed to start')
  end
end

function main()
  if not doesDirectoryExist(DIR) then
    createDirectory(DIR)
  end

  if doesFileExist(TARGET) then
    peetland = script.load(TARGET)
  end

  while true do
    wait(0)

    if isKeyDown(vkeys.VK_CONTROL) and wasKeyPressed(vkeys.VK_T) then
      reload()
    end
  end
end
```
