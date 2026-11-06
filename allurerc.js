import { defineConfig } from 'allure';

export default defineConfig({
  name: 'Peetland',
  output: '.allure/report',
  // История прогонов: из неё строятся тренды и находятся нестабильные тесты. В CI история main
  // берётся из прошлого отчёта на GitHub Pages и публикуется вместе с новым (см. docs/process/ci.md)
  historyPath: '.allure/history.jsonl',
});
