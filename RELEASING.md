# Releasing

## Version bump guidelines

- **Patch** — only for fixing existing functionality, no API changes.
- **Minor** — non-breaking changes, usually smaller additions.
- **Major** — large changes and breaking changes.

## Stable releases

Stable public releases use the normal package version and npm `latest` dist-tag. They should be cut from `master` after the change is ready for the open-source package.

Current GitHub release automation is tag-based: pushing a tag like `v14.7.0` runs `.github/workflows/release.yml` to build release assets, create the GitHub Release, upload bundles, and deploy typedoc.

## Canary releases

Canary releases are temporary integration builds published to npm with the `canary` dist-tag. They are intended for validating committed branch state before it is ready to become a stable public release.

Use canaries when a consuming app needs to test or ship a ChordSheetJS change before the change has completed the normal open-source release process.

### Rules

- Publish canaries manually from your machine, not from GitHub Actions.
- Publish only from a clean git tree.
- The human must choose the intended stable bump: `patch`, `minor`, or `major`.
- Canary versions use the next stable version as their base:
  - `14.6.1-canary.0` for a patch canary after `14.6.0`
  - `14.7.0-canary.0` for a minor canary after `14.6.0`
  - `15.0.0-canary.0` for a major canary after `14.6.0`
- Newer canaries in the same line should include the work from earlier canaries in that line.
- If the base stable version is published without the canary work, that canary line is closed. Rebase onto latest `master` and start a new canary line.

### Publishing

From the committed branch state you want to publish:

```bash
yarn publish:canary patch
# or
yarn publish:canary minor
# or
yarn publish:canary major
```

The script will:

1. verify the git tree is clean,
2. verify local `package.json` matches npm `latest`,
3. compute the next canary version from npm's published versions,
4. temporarily write that version to `package.json`,
5. run `yarn build:release`,
6. publish with `yarn npm publish --tag canary`, and
7. restore the working tree to the committed state.

Use `--yes` to skip the confirmation prompt:

```bash
yarn publish:canary minor --yes
```

### Consuming

Prefer pinning the exact canary version in consuming apps:

```json
{
  "dependencies": {
    "chordsheetjs": "14.7.0-canary.2"
  }
}
```

Avoid depending on the floating tag unless automatic movement is intentional:

```json
{
  "dependencies": {
    "chordsheetjs": "canary"
  }
}
```

### Dead canaries

A canary line can die. For example, if `14.8.0-canary.2` exists and then `14.8.0` is released without that work, do not publish `14.8.0-canary.3`. Rebase the work and start a new line such as `14.8.1-canary.0` or `14.9.0-canary.0`.
