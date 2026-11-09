import { readFileSync } from 'node:fs';
import { globSync } from 'glob';

/** Scope коммита — имя пакета без `@peetland/` (см. docs/process/commits.md) */
const scopes = globSync('{toolkit,core,mod}/*/package.json')
  .concat('docs/package.json')
  .map((path) => JSON.parse(readFileSync(path, 'utf8')).name.replace('@peetland/', ''))
  .sort();

/** Подписи агентов, которых не должно быть в сообщениях коммитов (см. AGENTS.md) */
const agentSignatures = [/^co-authored-by:.*noreply@anthropic\.com/im, /^claude-session:/im];

export default {
  extends: ['@commitlint/config-angular'],
  plugins: [
    {
      rules: {
        'no-agent-signature': ({ raw }) => {
          const signature = agentSignatures
            .map((pattern) => raw.match(pattern))
            .find((match) => match !== null);

          return [
            !signature,
            `в сообщении коммита не должно быть подписи агента: ${signature?.[0]}`,
          ];
        },
      },
    },
  ],
  rules: {
    // Гайд Angular ограничивает строку 100 символами, а не 72, как config-angular
    'header-max-length': [2, 'always', 100],
    // Summary пишется на русском со строчной буквы, но может начинаться с аббревиатуры, например
    // ADR или README, а их config-angular принимает за заглавную букву
    'subject-case': [0],
    'scope-enum': [2, 'always', scopes],
    'no-agent-signature': [2, 'always'],
  },
};
