# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-21

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
- Confirmation flow for restarting an in-progress game

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
- Webpack 2 build system with hot reload
- Vuetify 0.12.7 pinned for UI consistency
- Production build with Caddy file server
- Comprehensive CLAUDE.md documentation for AI-assisted development
- Beads workflow integration for issue tracking

### Fixed
- All unit test failures resolved
- Components updated for Vuetify 0.x compatibility
- Testing infrastructure configured to work without Java dependency

### Technical Details

**Stack:**
- Vue.js 2.3.3 with Vue Router 2.3.1
- Vuetify 0.12.7 (Material Design UI)
- Webpack 2.6.1 with Babel 6
- Vitest 4.x for unit testing
- Playwright 1.57.0 for E2E testing

**Test Coverage:**
- Unit tests for all major components
- E2E tests covering complete game flows
- Edge case validation
- Special scoring combinations
- Multi-player scenarios

## [Unreleased]

### Planned
- Multiplayer mode enhancements
- Additional scoring variations
- Game statistics and history

---

[1.0.0]: https://github.com/cfoy/farkle/releases/tag/v1.0.0
