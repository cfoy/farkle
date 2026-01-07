#!/bin/bash
# Release workflow script
# Usage: ./scripts/release.sh [version]
# Example: ./scripts/release.sh 2.1.0

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Farkle Release Workflow ===${NC}\n"

# Step 1: Pull master
echo -e "${GREEN}[1/7] Pulling latest changes from master...${NC}"
git pull origin master

# Step 2: Show recent commits
echo -e "\n${GREEN}[2/7] Recent commits:${NC}"
git log --oneline -5

# Step 3: Check bd issues
echo -e "\n${GREEN}[3/7] Checking bd issues...${NC}"
echo -e "${YELLOW}Open issues:${NC}"
bd list --status=open
echo -e "\n${YELLOW}Recently closed issues:${NC}"
bd list --status=closed | head -10

# Step 4: Get version number
if [ -z "$1" ]; then
    echo -e "\n${YELLOW}Enter version number (e.g., 2.1.0):${NC}"
    read VERSION
else
    VERSION=$1
fi

echo -e "\n${YELLOW}Version: ${VERSION}${NC}"

# Step 5: Update CHANGELOG
echo -e "\n${GREEN}[4/7] Opening CHANGELOG.md for editing...${NC}"
echo -e "${YELLOW}Please update CHANGELOG.md with version ${VERSION} details.${NC}"
echo -e "${YELLOW}Press ENTER when done editing...${NC}"
${EDITOR:-nano} CHANGELOG.md
read -p "Changelog updated? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Release cancelled."
    exit 1
fi

# Step 6: Commit changelog
echo -e "\n${GREEN}[5/7] Committing CHANGELOG.md...${NC}"
git add CHANGELOG.md
git commit -m "Release version ${VERSION}"

# Step 7: Sync beads
echo -e "\n${GREEN}[6/7] Syncing beads...${NC}"
bd sync || echo "No beads changes to sync"

# Step 8: Create tag
echo -e "\n${GREEN}[7/7] Creating tag ${VERSION}...${NC}"
git tag -a "${VERSION}" -m "Version ${VERSION}"

# Step 9: Push everything
echo -e "\n${GREEN}Pushing to remote...${NC}"
git push && git push --tags

echo -e "\n${GREEN}✅ Release ${VERSION} complete!${NC}"
echo -e "View release at: https://github.com/cfoy/farkle/releases/tag/${VERSION}"
