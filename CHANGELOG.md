# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/cfoy/farkle/compare/1.2.0...HEAD
[1.2.0]: https://github.com/cfoy/farkle/compare/1.1.0...1.2.0
[1.1.0]: https://github.com/cfoy/farkle/compare/1.0.0...1.1.0
[1.0.0]: https://github.com/cfoy/farkle/releases/tag/1.0.0
