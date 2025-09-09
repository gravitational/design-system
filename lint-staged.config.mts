import type { Configuration } from 'lint-staged';

const config: Configuration = {
  '**/*.{ts,tsx,mts}': ['prettier --list-different', 'eslint'],
  '**/*.{md,mdx}': ['prettier --list-different'],
};

export { config as default };
