import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import assembleReleasePlan from '@changesets/assemble-release-plan';
import { parse as parseConfig } from '@changesets/config';
import parseChangeset from '@changesets/parse';
import type { NewChangeset, PreState, WrittenConfig } from '@changesets/types';
import { getPackages } from '@manypkg/get-packages';
import type { Octokit } from '@octokit/rest';

export async function getChangedPackages(
  octokit: Octokit,
  params: { repo: string; owner: string; pull_number: number }
) {
  const changedFiles = await octokit.rest.pulls
    .listFiles(params)
    .then(x => x.data.map(file => file.filename));
  const packages = await getPackages(process.cwd());

  const configPromise = readFile(
    join(process.cwd(), '.changeset/config.json'),
    'utf-8'
  ).then(content => JSON.parse(content) as WrittenConfig);

  const preStatePromise = readFile(
    join(process.cwd(), '.changeset/pre.json'),
    'utf-8'
  )
    .then(content => JSON.parse(content) as PreState)
    .catch(() => undefined);

  const changesetPromises: Promise<NewChangeset>[] = changedFiles
    .filter(
      file =>
        file.startsWith('.changeset/') &&
        file.endsWith('.md') &&
        file !== '.changeset/README.md'
    )
    .map(async file => {
      const match = /\.changeset\/([^.]+)\.md/.exec(file);
      if (!match) {
        throw new Error('could not get name from changeset filename');
      }

      const id = match[1];
      const content = await readFile(join(process.cwd(), file), 'utf-8');

      return { ...parseChangeset(content), id };
    });

  const releasePlan = assembleReleasePlan(
    await Promise.all(changesetPromises),
    packages,
    parseConfig(await configPromise, packages),
    await preStatePromise
  );

  const changedPackages = packages.packages
    .filter(pkg => {
      if (pkg.packageJson.name === 'bot') {
        return false;
      }

      const relativeDir = pkg.dir.replace(process.cwd(), '').replace(/^\//, '');

      if (relativeDir === '') {
        const otherPackageDirs = packages.packages
          .filter(p => p.dir !== pkg.dir)
          .map(p => p.dir.replace(process.cwd(), '').replace(/^\//, ''));

        return changedFiles.some(
          file => !otherPackageDirs.some(dir => file.startsWith(`${dir}/`))
        );
      }

      return changedFiles.some(file => file.startsWith(`${relativeDir}/`));
    })
    .map(pkg => pkg.packageJson.name);

  return {
    changedPackages,
    releasePlan,
  };
}
