# AI Agent Instructions for ChordSheetJS

Guidelines for AI agents (Claude, Copilot, Cursor, etc.) working on this codebase.

## Project Overview

ChordSheetJS is a JavaScript/TypeScript library for parsing and formatting chord sheets (ChordPro, Ultimate Guitar, chords-over-words formats).

## Setup

1. **Node.js** - Ensure Node.js is installed
2. **Yarn 4** - This project uses Yarn 4 via Corepack
   ```bash
   corepack enable  # If yarn doesn't work
   ```
3. **Install dependencies**:
   ```bash
   yarn install
   ```
4. **Build** (generates parsers and compiles TypeScript):
   ```bash
   yarn build
   ```

## Development Workflow

### Test-Driven Development (TDD)

Always work test-driven:

1. **Write a failing test first** - Before implementing any feature or fix
2. **Run the test** to confirm it fails for the right reason
3. **Implement the minimal code** to make the test pass
4. **Refactor** if needed, keeping tests green
5. **Run full test suite** before committing

### Commands

| Command | When to use |
|---------|-------------|
| `yarn test` | Before committing - runs lint + all tests |
| `yarn lint` | Quick check for code style issues |
| `yarn lint:fix` | Fix auto-fixable lint issues |
| `yarn build` | After changing `.pegjs` grammar files |
| `yarn build -f` | Force rebuild (regenerate all parsers) |
| `yarn build -r` | Build release files (for publishing) |
| `yarn release [major\|minor\|patch]` | Full release to npm (see below) |

### When to Run What

- **Starting work**: `yarn install` (if dependencies changed)
- **After modifying `.pegjs` files**: `yarn build`
- **Before committing**: `yarn test`
- **Lint errors**: Try `yarn lint:fix` first, then fix remaining manually

## Architecture

### Key Directories

```
src/
├── parser/           # Parsers (ChordPro, UltimateGuitar, ChordsOverWords)
│   └── */peg_parser.ts  # GENERATED - don't edit!
├── formatter/        # Output formatters
├── chord_sheet/      # Core classes (Song, Line, ChordLyricsPair, etc.)
└── chord/            # Chord parsing and manipulation

test/                 # Tests mirror src/ structure
```

### Generated Files

- **`peg_parser.ts` files** are generated from `.pegjs` grammars
- Run `yarn build` to regenerate parsers after grammar changes

## Code Style

Enforced by ESLint:

- Max 120 characters per line
- Max 25 lines per function
- Max 12 statements per function
- Max cyclomatic complexity: 11
- Max nesting depth: 2
- Single quotes for strings
- Object curly spacing: `{ like, this }`

## Git Workflow

### Working on Issues

1. Create a fresh branch from `master`
2. Work test-driven (write test → implement → refactor)
3. Run `yarn test` before committing
4. Create PR targeting `master`

### Commits

- Write clear, concise commit messages
- No AI attribution in commits (no Co-Authored-By lines)

### Pull Requests

- Keep PR descriptions short and focused
- Summary only, no test plan section needed

## Testing

- Tests are in `test/` directory, mirroring `src/` structure
- Use existing test patterns as examples
- Test both happy path and edge cases
- For parser changes, test with actual chord sheet examples

## Releasing

```bash
yarn release [major|minor|patch]
```

This command handles the full release process:
1. Runs all checks (lint + tests)
2. Builds all release files
3. Bumps the version in `package.json`
4. Commits the version bump
5. Creates a git tag
6. Pushes the commit and tag to origin
7. Publishes to npm

## Common Pitfalls

1. **Editing `peg_parser.ts`** - These are generated! Edit the `.pegjs` files instead
2. **Forgetting to build** - After `.pegjs` changes, run `yarn build`
3. **Skipping tests** - Always run `yarn test` before committing
