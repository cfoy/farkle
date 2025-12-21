import { test, expect } from '@playwright/test'

test.describe('Complete Game Setup Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('navigates to app and displays initial setup view', async ({ page }) => {
    // Verify page loads
    await expect(page).toHaveTitle(/Farkle/)

    // Verify setup components are visible
    await expect(page.locator('label:has-text("Name")')).toBeVisible()
    await expect(page.locator('input[type="text"]')).toBeVisible()
    await expect(page.locator('button:has-text("Add")')).toBeVisible()
    await expect(page.locator('button:has-text("Start Game")')).toBeVisible()
  })

  test('adds a single player via form', async ({ page }) => {
    // Enter player name
    const nameInput = page.locator('input[type="text"]')
    await nameInput.fill('Alice')

    // Click Add button
    await page.locator('button:has-text("Add")').click()

    // Verify player appears in the list
    await expect(page.locator('text=Alice')).toBeVisible()

    // Verify input is cleared
    await expect(nameInput).toHaveValue('')
  })

  test('adds multiple players and displays them in player list', async ({ page }) => {
    const nameInput = page.locator('input[type="text"]')

    // Add first player
    await nameInput.fill('Alice')
    await page.locator('button:has-text("Add")').click()
    await expect(page.locator('text=Alice')).toBeVisible()

    // Add second player
    await nameInput.fill('Bob')
    await page.locator('button:has-text("Add")').click()
    await expect(page.locator('text=Bob')).toBeVisible()

    // Add third player
    await nameInput.fill('Charlie')
    await page.locator('button:has-text("Add")').click()
    await expect(page.locator('text=Charlie')).toBeVisible()

    // Verify all three players are visible
    const playerList = page.locator('.list__tile__title')
    await expect(playerList).toHaveCount(3)
  })

  test('prevents game start with insufficient players (0 players)', async ({ page }) => {
    // Try to start game with no players
    await page.locator('button:has-text("Start Game")').click()

    // Verify setup view is still visible (game didn't start)
    await expect(page.locator('label:has-text("Name")')).toBeVisible()
    await expect(page.locator('input[type="text"]')).toBeVisible()
  })

  test('prevents game start with only 1 player', async ({ page }) => {
    // Add one player
    const nameInput = page.locator('input[type="text"]')
    await nameInput.fill('Alice')
    await page.locator('button:has-text("Add")').click()

    // Try to start game
    await page.locator('button:has-text("Start Game")').click()

    // Verify setup view is still visible
    await expect(page.locator('label:has-text("Name")')).toBeVisible()
    await expect(page.locator('text=Alice')).toBeVisible()
  })

  test('starts game with 2 players and displays game view', async ({ page }) => {
    const nameInput = page.locator('input[type="text"]')

    // Add two players
    await nameInput.fill('Alice')
    await page.locator('button:has-text("Add")').click()

    await nameInput.fill('Bob')
    await page.locator('button:has-text("Add")').click()

    // Click Start Game
    await page.locator('button:has-text("Start Game")').click()

    // Verify game view is displayed
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()

    // Verify setup components are hidden
    await expect(page.locator('label:has-text("Name")')).not.toBeVisible()

    // Verify game components are visible
    await expect(page.locator('button', { hasText: 'One' }).first()).toBeVisible()
    await expect(page.locator('button', { hasText: 'Five' }).first()).toBeVisible()
    await expect(page.locator('button:has-text("Done")')).toBeVisible()

    // Verify Score component shows both players
    const scoreTiles = page.locator('.list__tile__title')
    await expect(scoreTiles).toHaveCount(2)
  })

  test('starts game with 3 players and displays correct initial state', async ({ page }) => {
    const nameInput = page.locator('input[type="text"]')

    // Add three players
    await nameInput.fill('Alice')
    await page.locator('button:has-text("Add")').click()

    await nameInput.fill('Bob')
    await page.locator('button:has-text("Add")').click()

    await nameInput.fill('Charlie')
    await page.locator('button:has-text("Add")').click()

    // Start game
    await page.locator('button:has-text("Start Game")').click()

    // Verify game started with first player
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()

    // Verify all three players appear in score display
    const scoreList = page.locator('.list__tile__title')
    await expect(scoreList).toHaveCount(3)
  })

  test('complete setup flow: add players, verify list, start game', async ({ page }) => {
    const nameInput = page.locator('input[type="text"]')

    // Initial state: setup view
    await expect(page.locator('label:has-text("Name")')).toBeVisible()

    // Step 1: Add first player
    await nameInput.fill('Alice')
    await page.locator('button:has-text("Add")').click()
    await expect(page.locator('text=Alice')).toBeVisible()
    await expect(nameInput).toHaveValue('')

    // Step 2: Add second player
    await nameInput.fill('Bob')
    await page.locator('button:has-text("Add")').click()
    await expect(page.locator('text=Bob')).toBeVisible()
    await expect(nameInput).toHaveValue('')

    // Step 3: Verify player list displays correctly (2 players)
    const playerList = page.locator('.list__tile__title')
    await expect(playerList).toHaveCount(2)

    // Step 4: Click Start Game button
    await page.locator('button:has-text("Start Game")').click()

    // Step 5: Verify game view loads
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()
    await expect(page.locator('button:has-text("Done")')).toBeVisible()

    // Step 6: Verify setup view is hidden
    await expect(page.locator('label:has-text("Name")')).not.toBeVisible()
    await expect(nameInput).not.toBeVisible()

    // Step 7: Verify scoreboard shows both players
    const scoreTiles = page.locator('.list__tile__title')
    await expect(scoreTiles).toHaveCount(2)
  })

  test('adds 4 players and starts game successfully', async ({ page }) => {
    const nameInput = page.locator('input[type="text"]')
    const players = ['Alice', 'Bob', 'Charlie', 'Dave']

    // Add all four players
    for (const playerName of players) {
      await nameInput.fill(playerName)
      await page.locator('button:has-text("Add")').click()
      await expect(page.locator(`text=${playerName}`)).toBeVisible()
    }

    // Verify all players in list
    const playerList = page.locator('.list__tile__title')
    await expect(playerList).toHaveCount(4)

    // Start game
    await page.locator('button:has-text("Start Game")').click()

    // Verify game started
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()

    // Verify all four players in scoreboard
    const scoreTiles = page.locator('.list__tile__title')
    await expect(scoreTiles).toHaveCount(4)
  })

  test('maintains player order from setup to game view', async ({ page }) => {
    const nameInput = page.locator('input[type="text"]')

    // Add players in specific order
    await nameInput.fill('Charlie')
    await page.locator('button:has-text("Add")').click()

    await nameInput.fill('Alice')
    await page.locator('button:has-text("Add")').click()

    await nameInput.fill('Bob')
    await page.locator('button:has-text("Add")').click()

    // Start game
    await page.locator('button:has-text("Start Game")').click()

    // First player should be the first one added (Charlie)
    await expect(page.locator('text=Current Player: Charlie')).toBeVisible()

    // Verify player order in scoreboard matches add order
    const scoreTiles = page.locator('.list__tile__title')
    await expect(scoreTiles.nth(0)).toContainText('Charlie')
    await expect(scoreTiles.nth(1)).toContainText('Alice')
    await expect(scoreTiles.nth(2)).toContainText('Bob')
  })
})
