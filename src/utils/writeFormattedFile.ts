import { writeFile } from 'node:fs/promises';

import prettier, { resolveConfig, resolveConfigFile } from 'prettier';

export async function writeFormattedFile(path: string, content: string) {
  const configFile = await resolveConfigFile(import.meta.dirname);
  const config = await resolveConfig(path, {
    config: configFile ?? undefined,
  });

  const parser = path.endsWith('.mdx') ? 'mdx' : 'babel-ts';

  const formatted = await prettier.format(content, {
    ...config,
    parser,
    filepath: path,
  });

  await writeFile(path, formatted, 'utf-8');
}

export async function formatString(content: string) {
  const configFile = await resolveConfigFile(import.meta.dirname);
  const config = await resolveConfig(import.meta.dirname, {
    config: configFile ?? undefined,
  });

  return prettier.format(content, {
    ...config,
    parser: 'babel-ts',
  });
}
