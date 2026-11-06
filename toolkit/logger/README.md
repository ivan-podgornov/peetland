# @peetland/logger

Интерфейс логера `ILogger` с тремя уровнями: `info`, `warn` и `error`. Реализации в пакете нет:
куда писать лог, решает слой, который знает об окружении. Например, `GtaLogger` из
`@peetland/gta-sa` пишет в `moonloader.log`.

Как пакет устроен и как с ним работать, описано в [CONTRIBUTING.md](./CONTRIBUTING.md).
