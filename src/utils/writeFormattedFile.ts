import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { format, type FormatOptions } from 'oxfmt';

async function loadConfig(): Promise<FormatOptions> {
  const configPath = resolve(import.meta.dirname, '../../.oxfmtrc.json');
  const raw = await readFile(configPath, 'utf-8');

  return JSON.parse(raw) as FormatOptions;
}

export async function writeFormattedFile(path: string, content: string) {
  const config = await loadConfig();
  const result = await format(path, content, config);

  await writeFile(path, result.code, 'utf-8');
}

export async function formatString(content: string): Promise<string> {
  const config = await loadConfig();
  const result = await format('file.tsx', content, config);

  return result.code;
}

export async function formatForPath(path: string, content: string) {
  const config = await loadConfig();
  const result = await format(path, content, config);

  return result.code;
}
