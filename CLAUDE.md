# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Farkle is a Vue.js 3.5 dice game application. The codebase uses modern tooling (Vite 5.4, esbuild) with modern testing infrastructure (Vitest, Playwright). The application is fully migrated to Vue 3 (no compat mode).

The application uses Vuetify 3.11.x for Material Design components and styling.

## Essential Commands

### Development
```bash
npm install              # Install dependencies
npm run dev             # Start Vite dev server at localhost:8080 with HMR
npm start               # Alias for npm run dev
npm run build           # Production build with Vite
npm run preview         # Preview production build locally on port 8080
npm run serve           # Alias for preview
```

### Testing
```bash
npm run test:unit        # Run unit tests in watch mode (Vitest)
npm run test:unit:ui     # Run unit tests with Vitest UI
npm run test:unit:run    # Run unit tests once (headless)
npm run test:coverage    # Generate coverage report
npm run test:e2e         # Run E2E tests (Playwright)
npm run test:e2e:ui      # Run E2E tests with Playwright UI
npm test                 # Run all tests (unit + E2E)
```

### Code Quality
```bash
npm run lint            # Run ESLint on src and test directories
```

## Architecture

### Component Hierarchy

The application has a single-page flow with nested components:

```
App.vue (root with Vuetify layout)
  └─ router-view
       └─ Farkle.vue (game coordinator)
            ├─ CreatePlayer.vue (player setup form)
            ├─ PlayerList.vue (displays players before game starts)
            └─ FarkleGame.vue (main game screen, shown after game starts)
                 ├─ FarkleTurn.vue (turn scoring buttons - ones, fives, triples, etc.)
                 └─ Score.vue (scoreboard display)
```

**Key state flow:**
- `Farkle.vue` manages the `players` array and `started` boolean
- When `started` is false: shows player creation UI
- When `started` is true: shows `FarkleGame` component
- `FarkleGame` manages turn rotation via `currentPlayer` index
- Scoring flows up via events: `FarkleTurn` → `FarkleGame` → updates `players[currentPlayer].score`

### Technology Stack

- **Vue 3.5.26**: Pure Vue 3 (no compat mode) - fully migrated from Vue 2
- **Vuetify 3.11.x**: Material Design component framework
  - Loaded as npm package with tree-shaking for optimal bundle size
  - Icons: MDI (Material Design Icons) via @mdi/font
  - Plugin configured in main.js with createVuetify()
  - **Note**: Vuetify 3 is NOT compatible with Vue 3 compat mode - requires pure Vue 3
- **Vue Router 4.6.4**: Uses ESM-only named imports (`createRouter`, `createWebHashHistory`)
- **Build**: Vite 5.4+ with @vitejs/plugin-vue and esbuild transpilation
- **Testing**: Vitest 4.x with @vue/test-utils 2.4.6, Playwright for E2E
- **Environment**: happy-dom for unit tests

### Module Resolution

The project uses `@` alias for src directory:
- `@/components/Farkle` → `src/components/Farkle.vue`
- Configured in `vite.config.js`

### Testing Structure

**Unit tests** (`test/unit/components/*.spec.js`):
- Use Vitest with happy-dom environment
- Setup file at `test/setup.js` provides Vuetify 3 component stubs for isolated testing
- Component tests use `mount()` from @vue/test-utils v2
- Stub child components to isolate testing
- Vuetify stubs include v-row/v-col, v-btn, v-list-item (with slots), v-chip, v-alert, etc.
- API changes from v1: use `props` instead of `propsData`, direct VM assignment instead of `setData()`

**E2E tests** (`test/e2e/*.spec.js`):
- Playwright with Chromium
- Auto-starts dev server at localhost:8080
- Config at `playwright.config.js`

**Running a single test file:**
```bash
npx vitest run test/unit/components/Farkle.spec.js
npx playwright test test/e2e/game-flow.spec.js
```

## Important Constraints

### Vuetify 3 Usage

This project uses **Vuetify 3.11.x** with the following conventions:

**Grid System:**
- Use `<v-row>` and `<v-col>` for layout
- Breakpoint props: `cols`, `sm`, `md`, `lg`, `xl` (e.g., `<v-col cols="12" md="6">`)

**Buttons:**
- Use `variant` prop: `"text"`, `"flat"`, `"elevated"`, `"outlined"`, `"tonal"` (e.g., `<v-btn variant="text">`)
- Use `color` prop for theme colors: `"primary"`, `"error"`, `"success"`, `"warning"`
- Use `size` prop: `"small"`, `"default"`, `"large"`, `"x-large"`

**Event Handling:**
- No `.native` modifier needed on Vuetify components (Vue 3 removed it)
- Use `@click` instead of `v-on:click.native`

**Lists:**
- Use `<v-list-item>` with `<template v-slot:prepend>` and `<template v-slot:append>` for icons/actions
- `v-list-item-title` and `v-list-item-subtitle` are direct children of v-list-item
- `v-list-subheader` instead of `v-subheader`

**Alerts:**
- Use `type` prop: `"success"`, `"info"`, `"warning"`, `"error"` (e.g., `<v-alert type="warning">`)

**Chips:**
- Use `size` prop: `"small"`, `"default"`, `"large"`
- Use `color` prop for theme colors (e.g., `<v-chip size="small" color="success">`)

### Vite Configuration

**Configuration file:** `vite.config.js` (unified dev/build/test config)

**Key settings:**
- Dev server port: 8080 (required for E2E tests)
- Full Vue build with template compiler via alias
- `@` alias pointing to `src/`
- Public assets in `public/` directory
- Build output to `dist/` with assets in `dist/static/`
- PostCSS autoprefixer support
- Integrated Vitest configuration

**Build output structure:**
```
dist/
  index.html
  static/
    js/
      vendor.[hash].js    # node_modules dependencies
      index.[hash].js     # application code
    css/
      index.[hash].css    # extracted styles
```

**Dev server:**
- Vite dev server runs on port 8080 with instant HMR
- E2E tests expect this port
- Auto-opens browser by default

### Dependencies

- Node.js 18.0.0+ required (20.18.1 recommended, see .nvmrc)
- Vite 5.4+ with esbuild for fast builds
- ESLint 3.x with Standard config (legacy)

## Node Version Management

```bash
nvm install    # Install Node version from .nvmrc
nvm use        # Switch to project Node version
```

## Git Workflow

This project uses Beads for issue tracking. See the session startup hook output for Beads commands.

### Feature Branch Workflow

**IMPORTANT**: Always create a new feature branch for new work:

```bash
# For new features, epics, or significant tasks
git checkout -b feature/descriptive-name

# Examples:
git checkout -b feature/winning-condition
git checkout -b feature/multiplayer-mode
git checkout -b bugfix/scoring-calculation
```

**Branching Guidelines**:
- Create feature branches from `master` (or current feature branch if building on top)
- Use descriptive branch names: `feature/`, `bugfix/`, `chore/`
- One feature/epic per branch
- Always start a new branch before creating beads epics or beginning significant work

**Completing Feature Work**:
When a feature is complete, create a pull request using the GitHub CLI:

```bash
gh pr create --title "Feature: Descriptive Title" --body "Description of changes"
```

See the GitHub CLI section in this file for more details on PR creation.

### Release Workflow

**IMPORTANT**: When a PR is merged and ready for release, use the automated release workflow.

**Automated Release (for Claude Code)**:

When the user says "PR merged" or requests a release:

1. Pull and analyze changes:
   ```bash
   git pull origin master
   git log --oneline -5
   bd list --status=closed | head -20
   ```

2. Determine the semantic version number:
   - Check CHANGELOG.md for current version
   - MAJOR: Breaking changes
   - MINOR: New features (backward compatible)
   - PATCH: Bug fixes

3. Generate changelog content based on merged changes

4. Run the automated release script:
   ```bash
   ./scripts/release-auto.sh "X.Y.Z" "### Added

   #### Feature Name (PR #XX)
   - Description of changes
   - Related bd issues closed
   "
   ```

The script automatically:
- Updates CHANGELOG.md with new version entry
- Commits the changelog
- Syncs beads
- Creates and pushes git tag
- Pushes all changes to remote

**Detailed instructions**: See `.claude/commands/release.md` for the complete workflow template.
