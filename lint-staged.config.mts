import type { Configuration } from 'lint-staged';

const config: Configuration = {
  '**/*.{ts,tsx,mts}': ['oxfmt --check', 'oxlint'],
  '**/*.{md,mdx}': ['oxfmt --check --no-error-on-unmatched-pattern'],

  // Context-aware generator checks. Functions return parameterless
  // commands so lint-staged doesn't append file paths.
  'src/icons/icons.ts': () => 'pnpm generate-icons --check',
  'src/components/**/*.{ts,tsx}': () => 'pnpm generate-props --check',
};

export { config as default };
