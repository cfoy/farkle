import { test, expect } from '@playwright/test'

test.describe('Farkle Scenario Tests', () => {
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

  test('farkle resets points to 0 and does not add to score', async ({ page }) => {
    // Accumulate points during turn
    await page.getByRole('button', { name: 'One', exact: true }).click()
    await page.getByRole('button', { name: 'Five', exact: true }).click()
    await page.getByRole('button', { name: '111', exact: true }).click()

    // Verify points accumulated
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 450')

    // Click Farkle button
    await page.getByRole('button', { name: 'Farkle!', exact: true }).click()

    // Verify points reset to 0 in turn display
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 0')

    // Verify Alice's score is still 0 (points were NOT added)
    const scoreTiles = page.locator('.list__tile')
    await expect(scoreTiles.nth(0).locator('.list__tile__title')).toContainText('Alice')
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('0')

    // Verify next player's turn started (Bob)
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()
  })

  test('farkle with no accumulated points does not affect score', async ({ page }) => {
    // Click Farkle immediately without accumulating points
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 0')
    await page.getByRole('button', { name: 'Farkle!', exact: true }).click()

    // Alice's score should remain 0
    const scoreTiles = page.locator('.list__tile')
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('0')

    // Should move to Bob's turn
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()
  })

  test('farkle after previous successful turns preserves existing score', async ({ page }) => {
    // Alice's first turn: score some points successfully
    await page.getByRole('button', { name: 'One', exact: true }).click()
    await page.getByRole('button', { name: 'One', exact: true }).click()
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 200')
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Verify Alice's score is 200
    const scoreTiles = page.locator('.list__tile')
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('200')

    // Bob's turn
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()
    await page.getByRole('button', { name: 'Five', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Back to Alice's turn
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()

    // Alice's second turn: accumulate points then farkle
    await page.getByRole('button', { name: '333', exact: true }).click()
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 300')
    await page.getByRole('button', { name: 'Farkle!', exact: true }).click()

    // Alice's score should still be 200 (not 200+300)
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('200')

    // Should be Bob's turn
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()
  })

  test('consecutive farkles by different players work correctly', async ({ page }) => {
    const scoreTiles = page.locator('.list__tile')

    // Alice farkles
    await page.getByRole('button', { name: 'One', exact: true }).click()
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 100')
    await page.getByRole('button', { name: 'Farkle!', exact: true }).click()
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('0')

    // Bob's turn - Bob also farkles
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()
    await page.getByRole('button', { name: 'Five', exact: true }).click()
    await page.getByRole('button', { name: 'Five', exact: true }).click()
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 100')
    await page.getByRole('button', { name: 'Farkle!', exact: true }).click()
    await expect(scoreTiles.nth(1).locator('.list__tile__action')).toContainText('0')

    // Back to Alice's turn
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()

    // Both players should still have 0 score
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('0')
    await expect(scoreTiles.nth(1).locator('.list__tile__action')).toContainText('0')
  })

  test('farkle with high point value does not add to score', async ({ page }) => {
    // Accumulate a large number of points
    await page.getByRole('button', { name: 'Four of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Five', exact: true }).click()
    await page.getByRole('button', { name: 'Five', exact: true }).click()
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 1100')

    // Farkle with 1100 points
    await page.getByRole('button', { name: 'Farkle!', exact: true }).click()

    // Verify all 1100 points were lost
    const scoreTiles = page.locator('.list__tile')
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('0')

    // Next player's turn
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()
  })

  test('player rotation continues correctly after farkle', async ({ page }) => {
    // Setup 3-player game for better rotation testing
    await page.goto('/')

    const nameInput = page.locator('input[type="text"]')
    await nameInput.fill('Alice')
    await page.locator('button:has-text("Add")').click()
    await nameInput.fill('Bob')
    await page.locator('button:has-text("Add")').click()
    await nameInput.fill('Charlie')
    await page.locator('button:has-text("Add")').click()
    await page.locator('button:has-text("Start Game")').click()

    const scoreTiles = page.locator('.list__tile')

    // Alice farkles
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()
    await page.getByRole('button', { name: 'One', exact: true }).click()
    await page.getByRole('button', { name: 'Farkle!', exact: true }).click()
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('0')

    // Bob scores successfully
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()
    await page.getByRole('button', { name: 'Five', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(1).locator('.list__tile__action')).toContainText('50')

    // Charlie farkles
    await expect(page.locator('text=Current Player: Charlie')).toBeVisible()
    await page.getByRole('button', { name: '111', exact: true }).click()
    await page.getByRole('button', { name: 'Farkle!', exact: true }).click()
    await expect(scoreTiles.nth(2).locator('.list__tile__action')).toContainText('0')

    // Should rotate back to Alice
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()

    // Verify scores: Alice 0, Bob 50, Charlie 0
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('0')
    await expect(scoreTiles.nth(1).locator('.list__tile__action')).toContainText('50')
    await expect(scoreTiles.nth(2).locator('.list__tile__action')).toContainText('0')
  })
})
