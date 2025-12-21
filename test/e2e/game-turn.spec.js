import { test, expect } from '@playwright/test'

test.describe('Complete Game Turn with Scoring', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')

    // Setup: Add two players and start game
    const nameInput = page.locator('input[type="text"]')

    await nameInput.fill('Alice')
    await page.locator('button:has-text("Add")').click()

    await nameInput.fill('Bob')
    await page.locator('button:has-text("Add")').click()

    await page.locator('button:has-text("Start Game")').click()

    // Verify game started
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()
  })

  test('accumulates points when clicking scoring buttons', async ({ page }) => {
    // Initial state: Points should be 0
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 0')

    // Click "One" button (adds 100 points) - use exact text match
    await page.getByRole('button', { name: 'One', exact: true }).click()
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 100')

    // Click "Five" button (adds 50 points)
    await page.getByRole('button', { name: 'Five', exact: true }).click()
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 150')

    // Click "111" button (adds 300 points)
    await page.getByRole('button', { name: '111', exact: true }).click()
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 450')
  })

  test('completes turn, updates score, and rotates to next player', async ({ page }) => {
    // Alice's turn: score some points
    await page.getByRole('button', { name: 'One', exact: true }).click()
    await page.getByRole('button', { name: 'One', exact: true }).click()
    await page.getByRole('button', { name: 'Five', exact: true }).click()
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 250')

    // Click Done to end turn
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Verify Alice's score updated (should show 250 in scoreboard)
    // The score is in .list__tile__action, name is in .list__tile__title
    const scoreTiles = page.locator('.list__tile')
    await expect(scoreTiles.nth(0).locator('.list__tile__title')).toContainText('Alice')
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('250')

    // Verify player rotation: Bob is now current player
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()

    // Verify points reset to 0 for new turn
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 0')
  })

  test('scores multiple turns with different scoring combinations', async ({ page }) => {
    // Alice's first turn: One (100) + Five (50) = 150
    await page.getByRole('button', { name: 'One', exact: true }).click()
    await page.getByRole('button', { name: 'Five', exact: true }).click()
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 150')
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Verify Alice's score
    const scoreTiles = page.locator('.list__tile')
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('150')

    // Bob's turn: 111 (300) + 222 (200) = 500
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()
    await page.getByRole('button', { name: '111', exact: true }).click()
    await page.getByRole('button', { name: '222', exact: true }).click()
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 500')
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Verify Bob's score
    await expect(scoreTiles.nth(1).locator('.list__tile__action')).toContainText('500')

    // Should rotate back to Alice
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()

    // Alice's second turn: 333 (300) = 300
    await page.getByRole('button', { name: '333', exact: true }).click()
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 300')
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Verify Alice's score accumulated (150 + 300 = 450)
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('450')

    // Should be Bob's turn again
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()
  })

  test('handles triple scoring buttons correctly', async ({ page }) => {
    // Test various triple combinations
    await page.getByRole('button', { name: '111', exact: true }).click()
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 300')

    await page.getByRole('button', { name: '222', exact: true }).click()
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 500')

    await page.getByRole('button', { name: '333', exact: true }).click()
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 800')

    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Verify score persisted
    const scoreTiles = page.locator('.list__tile')
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('800')
  })

  test('handles high-value scoring combinations', async ({ page }) => {
    // Test Four of a Kind (1000 points)
    await page.getByRole('button', { name: 'Four of a Kind', exact: true }).click()
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 1000')

    // Add more points
    await page.getByRole('button', { name: 'Five', exact: true }).click()
    await page.getByRole('button', { name: 'Five', exact: true }).click()
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 1100')

    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Verify score
    const scoreTiles = page.locator('.list__tile')
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('1100')
  })

  test('player rotation works correctly with 3 players', async ({ page }) => {
    // Need to restart with 3 players - navigate back and setup
    await page.goto('/')

    const nameInput = page.locator('input[type="text"]')
    await nameInput.fill('Alice')
    await page.locator('button:has-text("Add")').click()

    await nameInput.fill('Bob')
    await page.locator('button:has-text("Add")').click()

    await nameInput.fill('Charlie')
    await page.locator('button:has-text("Add")').click()

    await page.locator('button:has-text("Start Game")').click()

    // Alice's turn
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()
    await page.getByRole('button', { name: 'One', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Bob's turn
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()
    await page.getByRole('button', { name: 'Five', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Charlie's turn
    await expect(page.locator('text=Current Player: Charlie')).toBeVisible()
    await page.getByRole('button', { name: '111', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Should rotate back to Alice
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()

    // Verify all scores
    const scoreTiles = page.locator('.list__tile')
    await expect(scoreTiles.nth(0).locator('.list__tile__title')).toContainText('Alice')
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('100')
    await expect(scoreTiles.nth(1).locator('.list__tile__title')).toContainText('Bob')
    await expect(scoreTiles.nth(1).locator('.list__tile__action')).toContainText('50')
    await expect(scoreTiles.nth(2).locator('.list__tile__title')).toContainText('Charlie')
    await expect(scoreTiles.nth(2).locator('.list__tile__action')).toContainText('300')
  })

  test('Farkle button resets points and ends turn', async ({ page }) => {
    // Accumulate some points
    await page.getByRole('button', { name: 'One', exact: true }).click()
    await page.getByRole('button', { name: 'Five', exact: true }).click()
    await page.getByRole('button', { name: '111', exact: true }).click()
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 450')

    // Click Farkle button
    await page.getByRole('button', { name: 'Farkle!', exact: true }).click()

    // Alice's score should still be 0 (points were lost)
    const scoreTiles = page.locator('.list__tile')
    await expect(scoreTiles.nth(0).locator('.list__tile__title')).toContainText('Alice')
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('0')

    // Should rotate to Bob
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()

    // Points should be reset to 0
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 0')
  })
})
