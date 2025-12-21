import { test, expect } from '@playwright/test'

test.describe('Edge Cases and Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('cannot start game with 0 players', async ({ page }) => {
    // Verify setup view is displayed
    await expect(page.locator('label:has-text("Name")')).toBeVisible()
    await expect(page.locator('input[type="text"]')).toBeVisible()
    await expect(page.locator('button:has-text("Start Game")')).toBeVisible()

    // Try to start game without adding any players
    await page.locator('button:has-text("Start Game")').click()

    // Game should NOT start - setup view should still be visible
    await expect(page.locator('label:has-text("Name")')).toBeVisible()
    await expect(page.locator('input[type="text"]')).toBeVisible()

    // Game view should NOT be visible
    await expect(page.locator('text=Current Player:')).not.toBeVisible()
    await expect(page.locator('button:has-text("Done")')).not.toBeVisible()
  })

  test('cannot start game with only 1 player', async ({ page }) => {
    const nameInput = page.locator('input[type="text"]')

    // Add one player
    await nameInput.fill('Alice')
    await page.locator('button:has-text("Add")').click()
    await expect(page.locator('text=Alice')).toBeVisible()

    // Try to start game
    await page.locator('button:has-text("Start Game")').click()

    // Game should NOT start - setup view should still be visible
    await expect(page.locator('label:has-text("Name")')).toBeVisible()
    await expect(page.locator('input[type="text"]')).toBeVisible()
    await expect(page.locator('text=Alice')).toBeVisible()

    // Game view should NOT be visible
    await expect(page.locator('text=Current Player: Alice')).not.toBeVisible()
    await expect(page.locator('button:has-text("Done")')).not.toBeVisible()
  })

  test('can start game with exactly 2 players (minimum requirement)', async ({ page }) => {
    const nameInput = page.locator('input[type="text"]')

    // Add two players
    await nameInput.fill('Alice')
    await page.locator('button:has-text("Add")').click()

    await nameInput.fill('Bob')
    await page.locator('button:has-text("Add")').click()

    // Start game
    await page.locator('button:has-text("Start Game")').click()

    // Game SHOULD start - verify game view is displayed
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()
    await expect(page.locator('button:has-text("Done")')).toBeVisible()

    // Setup view should be hidden
    await expect(page.locator('label:has-text("Name")')).not.toBeVisible()
  })

  test('empty player name submission does not add player', async ({ page }) => {
    const nameInput = page.locator('input[type="text"]')

    // Try to add player with empty name
    await nameInput.fill('')
    await page.locator('button:has-text("Add")').click()

    // No player should be added to the list
    const playerList = page.locator('.list__tile__title')
    await expect(playerList).toHaveCount(0)

    // Input should remain empty
    await expect(nameInput).toHaveValue('')
  })

  test('whitespace-only player name does not add player', async ({ page }) => {
    const nameInput = page.locator('input[type="text"]')

    // Try to add player with only spaces
    await nameInput.fill('   ')
    await page.locator('button:has-text("Add")').click()

    // No player should be added to the list
    const playerList = page.locator('.list__tile__title')
    await expect(playerList).toHaveCount(0)
  })

  test('adding valid player after empty submission works correctly', async ({ page }) => {
    const nameInput = page.locator('input[type="text"]')

    // Try empty submission first
    await nameInput.fill('')
    await page.locator('button:has-text("Add")').click()

    // No player added
    let playerList = page.locator('.list__tile__title')
    await expect(playerList).toHaveCount(0)

    // Now add valid player
    await nameInput.fill('Alice')
    await page.locator('button:has-text("Add")').click()

    // Player should be added
    await expect(page.locator('text=Alice')).toBeVisible()
    playerList = page.locator('.list__tile__title')
    await expect(playerList).toHaveCount(1)
  })

  test('multiple empty submissions do not affect valid player additions', async ({ page }) => {
    const nameInput = page.locator('input[type="text"]')

    // Multiple empty submissions
    await nameInput.fill('')
    await page.locator('button:has-text("Add")').click()
    await nameInput.fill('   ')
    await page.locator('button:has-text("Add")').click()
    await nameInput.fill('')
    await page.locator('button:has-text("Add")').click()

    // No players added
    let playerList = page.locator('.list__tile__title')
    await expect(playerList).toHaveCount(0)

    // Add valid players
    await nameInput.fill('Alice')
    await page.locator('button:has-text("Add")').click()

    await nameInput.fill('Bob')
    await page.locator('button:has-text("Add")').click()

    // Both valid players added
    await expect(page.locator('text=Alice')).toBeVisible()
    await expect(page.locator('text=Bob')).toBeVisible()
    playerList = page.locator('.list__tile__title')
    await expect(playerList).toHaveCount(2)
  })

  test('can start game after failed start attempts', async ({ page }) => {
    const nameInput = page.locator('input[type="text"]')

    // Try to start with 0 players
    await page.locator('button:has-text("Start Game")').click()
    await expect(page.locator('label:has-text("Name")')).toBeVisible()

    // Add one player and try again
    await nameInput.fill('Alice')
    await page.locator('button:has-text("Add")').click()
    await page.locator('button:has-text("Start Game")').click()
    await expect(page.locator('label:has-text("Name")')).toBeVisible()

    // Add second player and start successfully
    await nameInput.fill('Bob')
    await page.locator('button:has-text("Add")').click()
    await page.locator('button:has-text("Start Game")').click()

    // Game should start
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()
  })

  test('player names with special characters are accepted', async ({ page }) => {
    const nameInput = page.locator('input[type="text"]')

    // Add players with special characters
    await nameInput.fill('Alice-123')
    await page.locator('button:has-text("Add")').click()

    await nameInput.fill("Bob's")
    await page.locator('button:has-text("Add")').click()

    await nameInput.fill('Charlie_2024')
    await page.locator('button:has-text("Add")').click()

    // Verify all players added
    await expect(page.locator('text=Alice-123')).toBeVisible()
    await expect(page.locator("text=Bob's")).toBeVisible()
    await expect(page.locator('text=Charlie_2024')).toBeVisible()

    const playerList = page.locator('.list__tile__title')
    await expect(playerList).toHaveCount(3)
  })

  test('long player names are accepted', async ({ page }) => {
    const nameInput = page.locator('input[type="text"]')

    // Add player with long name
    const longName = 'ThisIsAVeryLongPlayerNameThatShouldStillWork'
    await nameInput.fill(longName)
    await page.locator('button:has-text("Add")').click()

    // Verify player added
    await expect(page.locator(`text=${longName}`)).toBeVisible()
  })

  test('duplicate player names are allowed', async ({ page }) => {
    const nameInput = page.locator('input[type="text"]')

    // Add same name twice
    await nameInput.fill('Alice')
    await page.locator('button:has-text("Add")').click()

    await nameInput.fill('Alice')
    await page.locator('button:has-text("Add")').click()

    // Both players with same name should be added
    const playerList = page.locator('.list__tile__title')
    await expect(playerList).toHaveCount(2)

    // Can start game with duplicate names
    await page.locator('button:has-text("Start Game")').click()
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()
  })

  test('player name is trimmed of leading/trailing whitespace', async ({ page }) => {
    const nameInput = page.locator('input[type="text"]')

    // Add player with leading/trailing spaces
    await nameInput.fill('  Alice  ')
    await page.locator('button:has-text("Add")').click()

    // Player should be added with trimmed name
    await expect(page.locator('text=Alice')).toBeVisible()
  })

  test('maximum number of players can be added', async ({ page }) => {
    const nameInput = page.locator('input[type="text"]')

    // Add many players
    const playerNames = []
    for (let i = 1; i <= 10; i++) {
      playerNames.push(`Player${i}`)
    }

    for (const name of playerNames) {
      await nameInput.fill(name)
      await page.locator('button:has-text("Add")').click()
    }

    // Verify all players added
    const playerList = page.locator('.list__tile__title')
    await expect(playerList).toHaveCount(10)

    // Can start game with many players
    await page.locator('button:has-text("Start Game")').click()
    await expect(page.locator('text=Current Player: Player1')).toBeVisible()
  })

  test('game state persists correctly after setup', async ({ page }) => {
    const nameInput = page.locator('input[type="text"]')

    // Add players
    await nameInput.fill('Alice')
    await page.locator('button:has-text("Add")').click()

    await nameInput.fill('Bob')
    await page.locator('button:has-text("Add")').click()

    await nameInput.fill('Charlie')
    await page.locator('button:has-text("Add")').click()

    // Start game
    await page.locator('button:has-text("Start Game")').click()

    // Verify game started with all players
    const scoreTiles = page.locator('.list__tile')
    await expect(scoreTiles).toHaveCount(3)

    // Verify all players present in scoreboard
    await expect(scoreTiles.nth(0).locator('.list__tile__title')).toContainText('Alice')
    await expect(scoreTiles.nth(1).locator('.list__tile__title')).toContainText('Bob')
    await expect(scoreTiles.nth(2).locator('.list__tile__title')).toContainText('Charlie')

    // Verify all start with 0 score
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('0')
    await expect(scoreTiles.nth(1).locator('.list__tile__action')).toContainText('0')
    await expect(scoreTiles.nth(2).locator('.list__tile__action')).toContainText('0')
  })

  test('cannot return to player setup after game starts', async ({ page }) => {
    const nameInput = page.locator('input[type="text"]')

    // Add players and start game
    await nameInput.fill('Alice')
    await page.locator('button:has-text("Add")').click()

    await nameInput.fill('Bob')
    await page.locator('button:has-text("Add")').click()

    await page.locator('button:has-text("Start Game")').click()

    // Verify game started
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()

    // Setup components should not be visible (but Restart Game button should be)
    await expect(page.locator('label:has-text("Name")')).not.toBeVisible()
    await expect(page.locator('button:has-text("Add")')).not.toBeVisible()
    await expect(page.getByRole('button', { name: 'Start Game', exact: true })).not.toBeVisible()

    // Play a turn
    await page.getByRole('button', { name: 'One', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Setup should still not be visible
    await expect(page.locator('label:has-text("Name")')).not.toBeVisible()
    await expect(page.locator('button:has-text("Add")')).not.toBeVisible()
  })
})
