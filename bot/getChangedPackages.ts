import assembleReleasePlan from '@changesets/assemble-release-plan';
import { parse as parseConfig } from '@changesets/config';
import parseChangeset from '@changesets/parse';
import type {
  NewChangeset,
  PackageJSON,
  PreState,
  WrittenConfig,
} from '@changesets/types';
import type { Package, Packages } from '@manypkg/get-packages';
import type { Octokit } from '@octokit/rest';
import fetch from 'node-fetch';

export async function getChangedPackages({
  owner,
  repo,
  ref,
  changedFiles: changedFilesPromise,
  octokit,
}: {
  owner: string;
  repo: string;
  ref: string;
  changedFiles: string[] | Promise<string[]>;
  octokit: InstanceType<typeof Octokit>;
}) {
  let hasErrored = false;

  const githubToken = process.env.GITHUB_TOKEN;

  function fetchFile(path: string) {
    return fetch(
      `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${path}`,
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
        },
      }
    );
  }

  async function fetchJsonFile<T>(path: string): Promise<T> {
    try {
      const x = await fetchFile(path);

      return (await x.json()) as T;
    } catch (err) {
      hasErrored = true;

      // eslint-disable-next-line no-console
      console.error(err);

      return {} as T;
    }
  }

  async function fetchTextFile(path: string) {
    try {
      const x = await fetchFile(path);

      return await x.text();
    } catch (err) {
      hasErrored = true;

      // eslint-disable-next-line no-console
      console.error(err);

      return '';
    }
  }

  const rootPackageJsonContentsPromise =
    fetchJsonFile<PackageJSON>('package.json');
  const configPromise: Promise<WrittenConfig> = fetchJsonFile(
    '.changeset/config.json'
  );

  const tree = await octokit.rest.git.getTree({
    owner,
    repo,
    recursive: '1',
    tree_sha: ref,
  });

  const changedFiles = await changedFilesPromise;

  let preStatePromise: Promise<PreState> | undefined;
  let changesetPromises: Promise<NewChangeset>[] = [];

  for (let item of tree.data.tree) {
    if (!item.path) {
      continue;
    }

    if (item.path === '.changeset/pre.json') {
      preStatePromise = fetchJsonFile('.changeset/pre.json');

      continue;
    }

    if (
      item.path !== '.changeset/README.md' &&
      item.path.startsWith('.changeset') &&
      item.path.endsWith('.md') &&
      changedFiles.includes(item.path)
    ) {
      const res = /\.changeset\/([^.]+)\.md/.exec(item.path);
      if (!res) {
        throw new Error('could not get name from changeset filename');
      }

      const id = res[1];

      changesetPromises.push(
        fetchTextFile(item.path).then(text => {
          return { ...parseChangeset(text), id };
        })
      );
    }
  }

  let rootPackageJsonContent = await rootPackageJsonContentsPromise;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (hasErrored) {
    throw new Error('an error occurred when fetching files');
  }

  const root: Package = {
    dir: '.',
    packageJson: rootPackageJsonContent,
  };

  const packages: Packages = {
    root,
    tool: 'pnpm',
    packages: [root],
  };

  const releasePlan = assembleReleasePlan(
    await Promise.all(changesetPromises),
    packages,
    await configPromise.then(rawConfig => parseConfig(rawConfig, packages)),
    await preStatePromise
  );

  return {
    changedPackages: packages.packages
      .filter(pkg =>
        changedFiles.some(changedFile => changedFile.startsWith(`${pkg.dir}/`))
      )
      .map(x => x.packageJson.name),
    releasePlan,
  };
}
