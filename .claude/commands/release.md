# Release Command

When the user says "PR merged" or asks to "release" or "create a new version", follow this workflow:

## Steps

1. **Pull and analyze changes**
   ```bash
   git pull origin master
   git log --oneline -5
   ```

2. **Check bd issues**
   ```bash
   bd list --status=closed | head -20
   ```
   Look for recently closed issues related to the merged PR.

3. **Determine version number**
   - Look at git log to see what was merged
   - Check CHANGELOG.md for current version
   - Follow semantic versioning:
     - MAJOR: Breaking changes
     - MINOR: New features (backward compatible)
     - PATCH: Bug fixes
   - Increment appropriately

4. **Generate changelog content**
   Based on the git commits and closed bd issues, create markdown content describing:
   - Section header (### Added, ### Changed, ### Fixed)
   - Feature/fix title with PR number
   - Bullet points describing the changes
   - Reference to relevant bd issues

   Format:
   ```markdown
   ### Added

   #### Feature Name (PR #XX)
   - Description of change
   - Another detail
   - Related bd issues closed
   ```

5. **Run automated release script**
   ```bash
   ./scripts/release-auto.sh "X.Y.Z" "
   ### Added

   #### Feature Name (PR #XX)
   - Description line 1
   - Description line 2
   "
   ```

   **IMPORTANT**: Use proper escaping for the changelog content parameter:
   - Wrap in double quotes
   - Escape any internal double quotes
   - Use actual newlines in the string

6. **Verify completion**
   - Check that tag was created: `git tag | grep X.Y.Z`
   - Check that it was pushed: `git ls-remote --tags origin`
   - Confirm CHANGELOG.md was updated

## Example Usage

```bash
./scripts/release-auto.sh "2.2.0" "### Added

#### Dark Mode Support (PR #12)
- Implement dark mode toggle in settings
- Add theme persistence to localStorage
- Update all components to support dark theme
- Closed bd issues: farkle-abc, farkle-xyz
"
```

## Tips

- Always read recent git commits first to understand what changed
- Check bd issues to see what work was completed
- Keep changelog entries clear and user-focused
- Include PR numbers for traceability
- List closed bd issues when relevant
