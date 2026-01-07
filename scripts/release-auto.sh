#!/bin/bash
# Automated release script for Claude Code
# Usage: ./scripts/release-auto.sh <version> <changelog_content>
# Example: ./scripts/release-auto.sh 2.1.0 "Added new feature X"

set -e  # Exit on error

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Error: Version and changelog content required"
    echo "Usage: $0 <version> <changelog_content>"
    echo "Example: $0 2.1.0 'Added feature X\n- Item 1\n- Item 2'"
    exit 1
fi

VERSION="$1"
CHANGELOG_CONTENT="$2"
TODAY=$(date +%Y-%m-%d)

echo "=== Automated Release Workflow ==="
echo "Version: $VERSION"
echo "Date: $TODAY"
echo ""

# Step 1: Pull master
echo "[1/6] Pulling latest changes from master..."
git pull origin master

# Step 2: Check bd issues
echo ""
echo "[2/6] Checking bd issues..."
echo "Open issues:"
bd list --status=open || true
echo ""
echo "Recently closed issues:"
bd list --status=closed | head -10 || true

# Step 3: Update CHANGELOG.md
echo ""
echo "[3/6] Updating CHANGELOG.md..."

# Read current changelog
CHANGELOG_FILE="CHANGELOG.md"

# Create temporary file with new content
cat > /tmp/changelog_new.md << ENDOFFILE
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [${VERSION}] - ${TODAY}

${CHANGELOG_CONTENT}

ENDOFFILE

# Append everything after the [Unreleased] section from the old changelog
sed -n '/^## \[.*\] - [0-9]/,$p' "$CHANGELOG_FILE" >> /tmp/changelog_new.md

# Move the new changelog into place
mv /tmp/changelog_new.md "$CHANGELOG_FILE"

# Update version links at bottom of changelog
# Extract previous version from the old changelog
PREV_VERSION=$(grep -m 1 '^\[Unreleased\]:' "$CHANGELOG_FILE" | sed 's/.*compare\/\(.*\)\.\.\.HEAD/\1/' || echo "")

if [ -n "$PREV_VERSION" ]; then
    # Update the [Unreleased] link and add new version link
    sed -i "s|\[Unreleased\]:.*|\[Unreleased\]: https://github.com/cfoy/farkle/compare/${VERSION}...HEAD\n[${VERSION}]: https://github.com/cfoy/farkle/compare/${PREV_VERSION}...${VERSION}|" "$CHANGELOG_FILE"
fi

echo "CHANGELOG.md updated"

# Step 4: Commit changelog
echo ""
echo "[4/6] Committing CHANGELOG.md..."
git add CHANGELOG.md
git commit -m "Release version ${VERSION}"

# Step 5: Sync beads
echo ""
echo "[5/6] Syncing beads..."
bd sync || echo "No beads changes to sync"

# Step 6: Create tag and push
echo ""
echo "[6/6] Creating tag and pushing..."
git tag -a "${VERSION}" -m "Version ${VERSION}"
git push && git push --tags

echo ""
echo "✅ Release ${VERSION} complete!"
echo "View release at: https://github.com/cfoy/farkle/releases/tag/${VERSION}"
