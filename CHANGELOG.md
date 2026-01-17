# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.3.0] - 2026-01-16

### Added

#### 350 Points Scoring Button (PR #15)
- Added new scoring button for 350 points
- Placed alongside One and Five buttons for easy access
- Common scoring combination in Farkle (e.g., 3 ones + 1 five)

Closes: farkle-8on

#### Player List Reordering (PR #16)
- Player list now reorders when loser starts next game
- Loser automatically moves to top of list (index 0)
- Other players maintain their relative order
- Visual player display now matches turn order

Closes: farkle-cki

### Changed

#### Improved Button Click Target Separation (PR #14)
- Added empty column between Done and Farkle buttons
- Changed button layout from 6/6 to 5/2/5 grid
- Creates clear visible space between buttons
- Better click target separation to prevent accidental clicks

Closes: farkle-53f


## [2.2.0] - 2026-01-06

### Added

#### Game Over Restart Options (PR #13)
- Added Play Again button to restart with same players (loser goes first)
- Added Change Players button to return to player setup screen
- Improved button layout with responsive grid (stacked on mobile, side-by-side on desktop)
- Hides Restart Game button during Game Over screen for cleaner UI
- Added comprehensive tests for game restart functionality

Closes: farkle-zdv


## [2.1.1] - 2026-01-06

### Changed

#### Improved Button Spacing (PR #12)
- Separated Done and Farkle buttons to prevent accidental clicks
- Done and Farkle buttons now in distinct columns with larger size for better touch targets
- Added visual separation for Restart Game button with divider and warning color
- Improved overall button layout and visual hierarchy to reduce user errors

Closes: farkle-7i8


## [2.1.0] - 2026-01-06

### Added

#### Loser Plays First Feature (PR #11)
- Implement "loser plays first" house rule for next game
- After a game ends, the player with the lowest score becomes the starting player for the next game
- Starting player indicator updated from "Plays Next" to "Starting Player" for clarity
- Game state now tracks the next game's starting player
- When starting a new game, the designated starting player goes first
- Comprehensive E2E test suite for loser-plays-first functionality
- Updated game state management to persist starting player across game restarts

## [2.0.0] - 2025-12-26

### Changed

#### Complete Vue 3 + Vuetify 3 Migration (PR #10)
- **Major framework upgrade**: Migrated to pure Vue 3 (no compat mode) with Vuetify 3.11.4
- Upgraded Vue from 2.7.16 to 3.5.26 (pure Vue 3, removed compat mode)
- Upgraded Vuetify from 0.12.7 to 3.11.4
- Upgraded Vue Router from 2.8.1 to 4.6.4
- Upgraded @vue/test-utils from 1.3.6 to 2.4.6
- Migrated to Vue 3 API: `createApp()`, `createRouter()`, `createWebHashHistory()`
- Migrated all Vuetify components to v3 syntax (variant, type, slots, etc.)
- Material Design Icons via @mdi/font package

#### Critical Fixes
- Fixed blank page issue caused by Vuetify 3/compat mode incompatibility
  - Vuetify 3's LoaderSlot component fails with "Cannot read properties of undefined" in compat mode
  - Solution: Disabled compat mode entirely (all Vue 2 patterns already Vue 3 compatible)
- Fixed CreatePlayer data initialization error (`name` → `name: ''`)
- Removed redundant on-board warning alerts (popup feedback sufficient)

#### Build System
- Vite 5.4 configuration optimized for pure Vue 3
- Removed @vue/compat alias and compat mode configuration
- Tree-shaking enabled for Vuetify components
- Vendor bundle: 646.91 KB (optimized from 762.14 KB with compat mode)

#### Testing Infrastructure
- All 82 E2E test suites passing with Playwright
- Unit tests updated for Vue 3 and Vuetify 3 compatibility
- Test setup with Vuetify 3 component stubs

### Technical Details
- **Breaking Change**: Removed Vue 3 compat mode (incompatible with Vuetify 3)
- Vue Router 4 uses ESM-only named imports (no default export)
- Vuetify 3 loaded as npm package with full tree-shaking support
- All legacy Vue 2 patterns (v-bind:, v-on:, $emit) work in pure Vue 3
- Material Design Icons loaded via @mdi/font instead of CDN

## [1.5.0] - 2025-12-23

### Changed

#### Build System Migration (PR #5)
- Migrated build system from Webpack 2 to Vite 5.4
- Replaced webpack-dev-server with Vite dev server (instant HMR)
- Replaced Webpack plugins with native Vite features
- Build time improved from ~3s to <1s
- Dev server startup nearly instant with Vite
- Modern esbuild-based transpilation
- All 302 unit tests and 82 E2E tests passing

#### Cloudflare Pages Deployment (PR #8)
- Fixed unstyled site issue on Cloudflare Pages deployment
- Converted to CDN-based dependency loading for Vue, Vue Router, and Vuetify
- Ensures correct script loading order for ES modules
- Fixed protocol-relative URLs for Google Fonts (// → https://)
- Added relative asset paths (base: './') for compatibility
- Added _headers file for Cloudflare Pages security headers
- Bundle size reduced from 141 KB to 13.96 KB
- Build output optimized for static deployment

### Technical Improvements
- Vue 2.7.16, Vue Router 2.8.1, and Vuetify 0.12.7 now loaded via CDN
- Proper global scope handling for Vuetify auto-installation
- Eliminated vendor bundle (dependencies loaded from CDN)
- Faster page loads with CDN caching
- Simplified dependency management

## [1.4.0] - 2025-12-22

### Changed

#### Vue 2.7 Upgrade (PR #7)
- Upgraded Vue from 2.3.3 to 2.7.16 (latest Vue 2.x release)
- Upgraded Vue Router from 2.3.1 to 2.8.1
- Upgraded Vue Template Compiler from 2.3.3 to 2.7.16
- Enables Composition API compatibility layer for future migration
- Provides foundation for eventual Vue 3 upgrade
- All 302 unit tests and 82 E2E tests passing with zero compatibility issues
- Unblocks Webpack to Vite migration

## [1.3.0] - 2025-12-22

### Added

#### Win Tracking (PR #6)
- Track games won by each player across multiple game sessions
- `wins` field added to player data model (initialized to 0 for new players)
- Win count automatically increments when player wins a game
- localStorage persistence for win data across browser sessions
- Display win counts in PlayerList, Score, and GameOver components
- Winner's total wins prominently displayed in Game Over screen
- Win data loads automatically when adding existing players
- Comprehensive unit test suite for win tracking logic (191 lines)
- E2E test suite for win tracking across multiple games (325 lines)
  - Tests win increment functionality
  - Tests localStorage persistence
  - Tests wins persist after page reload
  - Tests multiple winners accumulating wins correctly

## [1.2.0] - 2025-12-21

### Added

#### 500 Point Minimum to Get on Board (PR #4)
- Classic Farkle house rule requiring 500 point minimum to start banking points
- `onBoard` property added to player data structure (defaults to false)
- Players must score at least 500 points in a single turn before banking allowed
- Visual indicators in Score component showing onBoard status
- User feedback alerts when attempting to bank insufficient points
- After getting on board, players can bank any valid score (minimum 50 points)
- Farkles (0 points) allowed at any time regardless of onBoard status
- Comprehensive E2E test suite in on-board-feature.spec.js
- Updated unit tests for FarkleGame and FarkleTurn components
- Updated integration tests for new onBoard property

## [1.1.0] - 2025-12-21

### Added

#### Winning Condition (PR #3)
- Turn tracking to monitor game progression
- Detection when player reaches 10,000 points threshold
- Last round logic ensuring all players get equal turns
- Winner determination after final round completes
- Game over UI displaying the winner
- Tie-breaker mechanism with dice roll selection when players tie
- Comprehensive E2E tests for winning conditions and tie scenarios

#### Restart Game Functionality (PR #2)
- Restart button to begin new game without refreshing page
- Game state reset while preserving player list
- Score reset on game restart

#### Testing Infrastructure (PR #1)
- Vitest unit testing framework with happy-dom environment
- Playwright E2E testing setup with Chromium
- Comprehensive test suite covering:
  - Player creation workflow
  - Game start validation
  - Turn scoring and player rotation
  - Score accumulation across turns
  - Complete player turn lifecycle
  - Farkle scenarios (rolling no scoring dice)
  - Multi-turn game progression
  - Special scoring combinations (straights, three pairs, six of a kind)
  - Edge cases and validation rules
- Code coverage reporting with Vitest Coverage V8
- Test automation scripts (unit, E2E, coverage)

#### Project Configuration
- Node.js version management with .nvmrc (20.18.1)
- ESLint configuration for code quality
- Vuetify 0.12.7 pinned for UI consistency
- Production build with Caddy file server
- Comprehensive CLAUDE.md documentation for AI-assisted development
- Beads workflow integration for issue tracking
- Feature branch workflow documentation

### Fixed
- All unit test failures resolved
- Components updated for Vuetify 0.x compatibility
- Testing infrastructure configured to work without Java dependency

## [1.0.0]

### Added
- Initial Farkle dice game implementation
- Vue.js 2.3.3 with Vue Router
- Vuetify 0.12.7 Material Design UI framework
- Player creation and management
- Turn-based gameplay with dice rolling
- Score tracking and accumulation
- Farkle game rules implementation
- Responsive design with meta viewport
- Webpack 2 build system with hot reload

### Technical Details

**Core Stack:**
- Vue.js 2.3.3 with Vue Router 2.3.1
- Vuetify 0.12.7 (Material Design UI)
- Webpack 2.6.1 with Babel 6
- ESLint 3.x with Standard config

**Component Architecture:**
- App.vue root component with Vuetify layout
- Farkle.vue game coordinator
- CreatePlayer.vue for player setup
- PlayerList.vue for player display
- FarkleGame.vue main game screen
- FarkleTurn.vue for turn scoring
- Score.vue scoreboard display

---

[Unreleased]: https://github.com/cfoy/farkle/compare/2.3.0...HEAD
[2.3.0]: https://github.com/cfoy/farkle/compare/2.2.0...2.3.0
[2.2.0]: https://github.com/cfoy/farkle/compare/2.1.1...2.2.0
[2.1.1]: https://github.com/cfoy/farkle/compare/2.1.0...2.1.1
[2.1.0]: https://github.com/cfoy/farkle/compare/2.0.0...2.1.0
[2.0.0]: https://github.com/cfoy/farkle/compare/1.5.0...2.0.0
[1.5.0]: https://github.com/cfoy/farkle/compare/1.4.0...1.5.0
[1.4.0]: https://github.com/cfoy/farkle/compare/1.3.0...1.4.0
[1.3.0]: https://github.com/cfoy/farkle/compare/1.2.0...1.3.0
[1.2.0]: https://github.com/cfoy/farkle/compare/1.1.0...1.2.0
[1.1.0]: https://github.com/cfoy/farkle/compare/1.0.0...1.1.0
[1.0.0]: https://github.com/cfoy/farkle/releases/tag/1.0.0
