import { test, expect } from '@playwright/test'

test.describe('Restart Game Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('restart button not visible before game starts', async ({ page }) => {
    // Verify restart button doesn't exist in setup view
    const restartButton = page.locator('button:has-text("Restart Game")')
    await expect(restartButton).not.toBeVisible()
  })

  test('restart button appears after game starts', async ({ page }) => {
    // Setup and start game
    const nameInput = page.locator('input[type="text"]')
    await nameInput.fill('Alice')
    await page.locator('button:has-text("Add")').click()
    await nameInput.fill('Bob')
    await page.locator('button:has-text("Add")').click()
    await page.locator('button:has-text("Start Game")').click()

    // Verify restart button is visible
    await expect(page.locator('button:has-text("Restart Game")')).toBeVisible()
  })

  test('restart returns to player setup with players preserved', async ({ page }) => {
    // Setup game with players
    const nameInput = page.locator('input[type="text"]')
    await nameInput.fill('Alice')
    await page.locator('button:has-text("Add")').click()
    await nameInput.fill('Bob')
    await page.locator('button:has-text("Add")').click()
    await page.locator('button:has-text("Start Game")').click()

    // Click restart
    await page.locator('button:has-text("Restart Game")').click()

    // Verify back to setup view
    await expect(page.locator('label:has-text("Name")')).toBeVisible()
    await expect(page.locator('button:has-text("Start Game")')).toBeVisible()

    // Verify players are still in the list
    await expect(page.locator('text=Alice')).toBeVisible()
    await expect(page.locator('text=Bob')).toBeVisible()
  })

  test('restart resets player scores to 0', async ({ page }) => {
    // Setup game
    const nameInput = page.locator('input[type="text"]')
    await nameInput.fill('Player 1')
    await page.locator('button:has-text("Add")').click()
    await nameInput.fill('Player 2')
    await page.locator('button:has-text("Add")').click()
    await page.locator('button:has-text("Start Game")').click()

    // Score some points (get on board with 500)
    await page.getByRole('button', { name: '555', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Verify score updated (Player 1 should have 500 points)
    const scoreTiles = page.locator('.list__tile')
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('500')

    // Click restart
    await page.locator('button:has-text("Restart Game")').click()

    // Start new game
    await page.locator('button:has-text("Start Game")').click()

    // Verify scores are reset to 0
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('0')
    await expect(scoreTiles.nth(1).locator('.list__tile__action')).toContainText('0')
  })

  test('can start a new game after restart', async ({ page }) => {
    // Setup and start initial game
    const nameInput = page.locator('input[type="text"]')
    await nameInput.fill('Alice')
    await page.locator('button:has-text("Add")').click()
    await nameInput.fill('Bob')
    await page.locator('button:has-text("Add")').click()
    await page.locator('button:has-text("Start Game")').click()

    // Restart
    await page.locator('button:has-text("Restart Game")').click()

    // Verify can start new game
    await expect(page.locator('button:has-text("Start Game")')).toBeVisible()
    await page.locator('button:has-text("Start Game")').click()

    // Verify game started again
    await expect(page.locator('button:has-text("Restart Game")')).toBeVisible()
    await expect(page.getByRole('button', { name: 'One', exact: true })).toBeVisible()
  })

  test('can add/remove players after restart before starting new game', async ({ page }) => {
    // Setup and start initial game
    const nameInput = page.locator('input[type="text"]')
    await nameInput.fill('Alice')
    await page.locator('button:has-text("Add")').click()
    await nameInput.fill('Bob')
    await page.locator('button:has-text("Add")').click()
    await page.locator('button:has-text("Start Game")').click()

    // Restart
    await page.locator('button:has-text("Restart Game")').click()

    // Add a new player
    await nameInput.fill('Charlie')
    await page.locator('button:has-text("Add")').click()

    // Verify all three players present
    await expect(page.locator('text=Alice')).toBeVisible()
    await expect(page.locator('text=Bob')).toBeVisible()
    await expect(page.locator('text=Charlie')).toBeVisible()

    // Start new game with 3 players
    await page.locator('button:has-text("Start Game")').click()
    await expect(page.locator('button:has-text("Restart Game")')).toBeVisible()
  })
})
