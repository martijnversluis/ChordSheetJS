#!/usr/bin/env tsx
import { createInterface } from 'readline/promises';
import { execFileSync, spawnSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

type Bump = 'patch' | 'minor' | 'major';

interface PackageJSON {
  name: string;
  version: string;
  [key: string]: unknown;
}

interface CanaryRelease {
  baseVersion: string;
  branch: string;
  commit: string;
  npmLatestVersion: string;
  packageName: string;
  version: string;
}

const PREID = 'canary';
const VALID_BUMPS = new Set<Bump>(['patch', 'minor', 'major']);

function run(command: string, args: string[], options: { stdio?: 'pipe' | 'inherit' } = {}): string {
  return execFileSync(command, args, {
    encoding: 'utf8',
    stdio: options.stdio === 'inherit' ? 'inherit' : ['ignore', 'pipe', 'pipe'],
  })?.toString().trim() ?? '';
}

function runChecked(command: string, args: string[]): void {
  const result = spawnSync(command, args, {
    env: {
      ...process.env,
      PATH: `${process.cwd()}/node_modules/.bin:${process.env.PATH ?? ''}`,
    },
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(' ')}`);
  }
}

function parseVersion(version: string): [number, number, number] {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)(?:-[0-9A-Za-z.-]+)?$/);

  if (!match) {
    throw new Error(`Unsupported semver version: ${version}`);
  }

  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function bumpVersion(version: string, bump: Bump): string {
  const [major, minor, patch] = parseVersion(version);

  switch (bump) {
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'major':
      return `${major + 1}.0.0`;
    default:
      throw new Error(`Unsupported bump: ${bump}`);
  }
}

function getPackageJSON(): PackageJSON {
  return JSON.parse(readFileSync('package.json', 'utf8')) as PackageJSON;
}

function writePackageVersion(version: string): void {
  const packageJSON = getPackageJSON();
  packageJSON.version = version;
  writeFileSync('package.json', `${JSON.stringify(packageJSON, null, 2)}\n`);
}

function getPublishedVersions(packageName: string): string[] {
  const output = run('npm', ['view', packageName, 'versions', '--json']);
  const parsed = JSON.parse(output) as string[] | string;
  return Array.isArray(parsed) ? parsed : [parsed];
}

function getNpmLatestVersion(packageName: string): string {
  return run('npm', ['view', packageName, 'dist-tags.latest']);
}

function assertCleanGitTree(): void {
  const status = run('git', ['status', '--porcelain']);

  if (status.length > 0) {
    throw new Error(`Canary publishing requires a clean git tree. Commit or stash these changes first:\n${status}`);
  }
}

function getNextCanaryVersion(baseVersion: string, publishedVersions: string[]): string {
  if (publishedVersions.includes(baseVersion)) {
    throw new Error(
      `Cannot publish ${baseVersion}-${PREID}.x because ${baseVersion} has already been published as stable.\n` +
      'This canary line is closed. Rebase onto the latest master/release and start a new canary line.',
    );
  }

  const escapedBase = baseVersion.replaceAll('.', '\\.');
  const canaryPattern = new RegExp(`^${escapedBase}-${PREID}\\.(\\d+)$`);
  const latestCanaryNumber = publishedVersions.reduce<number>((latest, version) => {
    const match = version.match(canaryPattern);
    return match ? Math.max(latest, Number(match[1])) : latest;
  }, -1);

  return `${baseVersion}-${PREID}.${latestCanaryNumber + 1}`;
}

async function confirmPublish(summary: string): Promise<boolean> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });

  try {
    const answer = await rl.question(`${summary}\n\nPublish this canary? [y/N] `);
    return answer.trim().toLowerCase() === 'y' || answer.trim().toLowerCase() === 'yes';
  } finally {
    rl.close();
  }
}

function printUsage(): void {
  console.log([
    'Usage: yarn publish:canary <patch|minor|major> [--yes]',
    '',
    'Publishes the current committed branch state as the next chordsheetjs canary prerelease.',
    '',
    'Examples:',
    '  yarn publish:canary patch',
    '  yarn publish:canary minor --yes',
  ].join('\n'));
}

function parseArgs(): { bump?: Bump; help: boolean; yes: boolean } {
  const args = process.argv.slice(2);
  return {
    bump: args.find((arg): arg is Bump => VALID_BUMPS.has(arg as Bump)),
    help: args.includes('--help') || args.includes('-h'),
    yes: args.includes('--yes') || args.includes('-y'),
  };
}

function getCanaryRelease(bump: Bump): CanaryRelease {
  const packageJSON = getPackageJSON();
  const npmLatestVersion = getNpmLatestVersion(packageJSON.name);

  if (packageJSON.version !== npmLatestVersion) {
    throw new Error(
      `Local package.json version (${packageJSON.version}) does not match npm latest (${npmLatestVersion}).\n` +
      'Rebase/pull the latest master before publishing a canary.',
    );
  }

  const baseVersion = bumpVersion(npmLatestVersion, bump);
  const publishedVersions = getPublishedVersions(packageJSON.name);
  const canaryVersion = getNextCanaryVersion(baseVersion, publishedVersions);

  return {
    baseVersion,
    branch: run('git', ['branch', '--show-current']),
    commit: run('git', ['rev-parse', '--short', 'HEAD']),
    npmLatestVersion,
    packageName: packageJSON.name,
    version: canaryVersion,
  };
}

function getSummary(release: CanaryRelease, bump: Bump): string {
  return [
    `Package:              ${release.packageName}`,
    `Branch:               ${release.branch}`,
    `Commit:               ${release.commit}`,
    `npm latest:           ${release.npmLatestVersion}`,
    `Requested bump:       ${bump}`,
    `Target stable base:   ${release.baseVersion}`,
    `Canary version:       ${release.version}`,
    `npm dist-tag:         ${PREID}`,
  ].join('\n');
}

function publishCanary(release: CanaryRelease): void {
  try {
    writePackageVersion(release.version);
    runChecked('yarn', ['build:release']);
    runChecked('yarn', ['npm', 'publish', '--tag', PREID]);
    console.log(`Published ${release.packageName}@${release.version} with dist-tag ${PREID}.`);
  } finally {
    runChecked('git', ['restore', '--worktree', '--', '.']);
  }
}

async function main(): Promise<void> {
  const { bump, help, yes } = parseArgs();

  if (!bump || help) {
    printUsage();
    process.exit(help ? 0 : 1);
  }

  assertCleanGitTree();

  const release = getCanaryRelease(bump);
  const summary = getSummary(release, bump);

  if (!yes && !(await confirmPublish(summary))) {
    console.log('Aborted.');
    return;
  }

  publishCanary(release);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
