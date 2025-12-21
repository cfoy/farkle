# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Farkle is a Vue.js 2.x dice game application built with Vuetify 0.12.7 for the UI framework. The codebase uses legacy tooling (Webpack 2, Babel 6) with modern testing infrastructure (Vitest, Playwright).

## Essential Commands

### Development
```bash
npm install              # Install dependencies
npm run dev             # Start dev server at localhost:8080 with hot reload
npm start               # Alias for npm run dev
npm run build           # Production build with minification
npm run build --report  # Build with bundle analyzer
npm run serve           # Serve production build using Caddy
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

- **Vue 2.3.3**: Uses full build with template compiler (vue.esm.js)
- **Vuetify 0.12.7**: Material design components (pinned version - see index.html CDN)
- **Vue Router 2.3.1**: Single route to Farkle component
- **Build**: Webpack 2.6.1 with Babel 6
- **Testing**: Vitest 4.x with @vue/test-utils 1.3.6, Playwright for E2E
- **Environment**: happy-dom for unit tests

### Module Resolution

The project uses `@` alias for src directory:
- `@/components/Farkle` → `src/components/Farkle.vue`
- Configured in both `vitest.config.js` and `build/webpack.base.conf.js`

### Testing Structure

**Unit tests** (`test/unit/components/*.spec.js`):
- Use Vitest with happy-dom environment
- Setup file at `test/setup.js` installs Vuetify globally
- Component tests use `mount()` from @vue/test-utils
- Stub child components to isolate testing

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

### Vuetify 0.x Compatibility

This project uses **Vuetify 0.12.7** (not modern 2.x or 3.x). Key differences:

- Uses `v-btn primary` instead of `color="primary"`
- Uses `v-btn v-on:click.native` instead of `@click`
- Component API differs significantly from modern Vuetify
- CDN is pinned in index.html - do not upgrade without testing

### Legacy Dependencies

- Node.js 18.0.0+ required (20.18.1 recommended, see .nvmrc)
- Webpack 2.x and Babel 6.x - do not upgrade without migration plan
- ESLint 3.x with Standard config - old syntax

### Development Server

The webpack dev server (build/dev-server.js) runs on port 8080. E2E tests expect this port.

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
