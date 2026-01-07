# Release Scripts

## Quick Release Workflow

After a PR is merged, run the release script to:
1. Pull latest changes from master
2. Show recent commits
3. Check bd issues (open and recently closed)
4. Update CHANGELOG.md
5. Commit the changelog
6. Sync beads
7. Create version tag
8. Push everything to remote

## Two Release Scripts

### 1. Interactive Release (`release.sh`)
For manual releases where you want to edit the changelog yourself.

### 2. Automated Release (`release-auto.sh`)
For automated releases (e.g., Claude Code) where changelog content is provided programmatically.

## Usage

**Using npm:**
```bash
npm run release
```

**Using the script directly:**
```bash
./scripts/release.sh 2.1.0
```

**Or without version argument (will prompt):**
```bash
./scripts/release.sh
```

### Shell Alias (Optional)

Add this to your `~/.bashrc` or `~/.zshrc` for a global `release` command:

```bash
# Farkle release workflow
alias farkle-release='./scripts/release.sh'
```

Then reload your shell:
```bash
source ~/.bashrc  # or source ~/.zshrc
```

Now you can run from anywhere in the project:
```bash
farkle-release 2.2.0
```

### What It Does

1. **Pulls master** - Ensures you have latest merged changes
2. **Shows commits** - Displays last 5 commits for context
3. **Shows bd issues** - Lists open issues and recently closed ones
4. **Prompts for version** - Enter semantic version (or pass as argument)
5. **Opens CHANGELOG** - Edit CHANGELOG.md with your preferred editor
6. **Commits changelog** - Creates commit: "Release version X.Y.Z"
7. **Syncs beads** - Runs `bd sync` to sync issue tracking
8. **Creates tag** - Annotated git tag with version number
9. **Pushes everything** - Pushes commits and tags to GitHub

### Environment Variables

- `EDITOR` - Text editor for CHANGELOG (defaults to `nano`)
  ```bash
  export EDITOR=vim  # Use vim instead of nano
  ```

### Tips

- Review `bd list --status=closed` output to see which bd issues were part of the PR
- Follow [Semantic Versioning](https://semver.org/):
  - MAJOR.MINOR.PATCH (e.g., 2.1.0)
  - MAJOR: Breaking changes
  - MINOR: New features (backward compatible)
  - PATCH: Bug fixes
- The script will pause for you to edit CHANGELOG.md - don't forget to save!

## Automated Release (for Claude Code)

### Usage

```bash
./scripts/release-auto.sh "2.2.0" "### Added

#### Feature Name (PR #12)
- Description of change 1
- Description of change 2
- Related bd issues: farkle-abc, farkle-xyz
"
```

### Parameters

1. **Version** (required) - Semantic version number (e.g., "2.2.0")
2. **Changelog content** (required) - Markdown content for this version's changelog entry

### What It Does

The automated script does everything the interactive script does, but:
- ✅ No user prompts - fully automated
- ✅ Changelog content provided as parameter
- ✅ Automatically inserts content into CHANGELOG.md
- ✅ Updates version comparison links
- ✅ Perfect for CI/CD or AI-assisted workflows

### Changelog Content Format

The changelog content should follow Keep a Changelog format:

```markdown
### Added

#### Feature Description (PR #XX)
- Bullet point 1
- Bullet point 2

### Changed

#### Another Change (PR #YY)
- Change description
```

**Sections:**
- `### Added` - New features
- `### Changed` - Changes in existing functionality
- `### Deprecated` - Soon-to-be removed features
- `### Removed` - Removed features
- `### Fixed` - Bug fixes
- `### Security` - Security fixes

### Claude Code Integration

See `.claude/commands/release.md` for detailed instructions on how Claude Code should use this script.
