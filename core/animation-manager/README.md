# @peetland/animation-manager

Менеджер анимаций актора. Проверяет параметры анимаций и следит, чтобы нужные анимации были
загружены. Анимации задаются id из `AnimationId`, а зациклены ли они, говорит `ANIMATIONS` — оба
лежат в `@peetland/game`, потому что ими описан `IActor.playAnimation`.

Как пакет устроен и как с ним работать, описано в [CONTRIBUTING.md](./CONTRIBUTING.md).
