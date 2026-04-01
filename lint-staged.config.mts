import type { Configuration } from 'lint-staged';

const config: Configuration = {
  '**/*.{ts,tsx,mts}': ['oxfmt --check', 'oxlint'],
  '**/*.{md,mdx}': ['oxfmt --check'],
};

export { config as default };
