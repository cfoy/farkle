import { test, expect } from '@playwright/test'

test.describe('500 Point Minimum to Get On Board', () => {
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

  test('shows warning when player not on board yet', async ({ page }) => {
    // Should show "Not on board yet!" warning
    const warningText = await page.textContent('body')
    expect(warningText).toContain('Not on board yet!')
    expect(warningText).toContain('You need 500 points in this turn to start scoring')
  })

  test('shows Not On Board status in scoreboard', async ({ page }) => {
    // Check scoreboard shows "Not On Board" chips for both players
    const scoreboard = page.locator('.list__tile')
    await expect(scoreboard.nth(0)).toContainText('Alice')
    await expect(scoreboard.nth(0)).toContainText('Not On Board')
    await expect(scoreboard.nth(1)).toContainText('Bob')
    await expect(scoreboard.nth(1)).toContainText('Not On Board')
  })

  test('prevents banking less than 500 points when not on board', async ({ page }) => {
    // Try to score less than 500 points
    await page.getByRole('button', { name: 'One', exact: true }).click()
    await page.getByRole('button', { name: 'One', exact: true }).click()
    await page.getByRole('button', { name: 'Five', exact: true }).click()

    // Verify turn total is 250
    await expect(page.locator('h5:has-text("Turn Total:")')).toContainText('Turn Total: 250')

    // Set up dialog handler before clicking Done
    page.once('dialog', async dialog => {
      expect(dialog.message()).toBe('You need 500 points to get on the board. Keep rolling or Farkle!')
      await dialog.accept()
    })

    // Try to click Done - should show alert and not bank
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Should still be Alice's turn
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()

    // Score should still be 0
    const scoreboard = page.locator('.list__tile')
    await expect(scoreboard.nth(0).locator('.list__tile__action')).toContainText('0')
  })

  test('allows banking exactly 500 points to get on board', async ({ page }) => {
    // Score exactly 500 points (Triple Fives = 500)
    await page.getByRole('button', { name: '555', exact: true }).click()
    await expect(page.locator('h5:has-text("Turn Total:")')).toContainText('Turn Total: 500')

    // Should show success message
    const pageText = await page.textContent('body')
    expect(pageText).toContain('Ready to get on board!')
    expect(pageText).toContain('You have 500 points - click Done to bank them!')

    // Click Done to bank
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Should rotate to Bob
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()

    // Alice's score should be 500 and show "On Board"
    const scoreboard = page.locator('.list__tile')
    await expect(scoreboard.nth(0).locator('.list__tile__action')).toContainText('500')
    await expect(scoreboard.nth(0)).toContainText('On Board')
  })

  test('allows banking more than 500 points to get on board', async ({ page }) => {
    // Score 600 points (Triple Sixes = 600)
    await page.getByRole('button', { name: '666', exact: true }).click()
    await expect(page.locator('h5:has-text("Turn Total:")')).toContainText('Turn Total: 600')

    // Click Done
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Should rotate to Bob
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()

    // Alice's score should be 600 and show "On Board"
    const scoreboard = page.locator('.list__tile')
    await expect(scoreboard.nth(0).locator('.list__tile__action')).toContainText('600')
    await expect(scoreboard.nth(0)).toContainText('On Board')
  })

  test('allows banking any amount after player is on board', async ({ page }) => {
    // Alice gets on board with 500 points
    await page.getByRole('button', { name: '555', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Bob gets on board with 500 points
    await page.getByRole('button', { name: '555', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Back to Alice - she's now on board, should be able to bank small amounts
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()

    // No warning should be shown since Alice is on board
    const pageText = await page.textContent('body')
    expect(pageText).not.toContain('Not on board yet!')

    // Score just 50 points (one Five)
    await page.getByRole('button', { name: 'Five', exact: true }).click()
    await expect(page.locator('h5:has-text("Turn Total:")')).toContainText('Turn Total: 50')

    // Should be able to click Done without alert
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Should rotate to Bob
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()

    // Alice's score should be 550 (500 + 50)
    const scoreboard = page.locator('.list__tile')
    await expect(scoreboard.nth(0).locator('.list__tile__action')).toContainText('550')
    await expect(scoreboard.nth(0)).toContainText('On Board')
  })

  test('allows farkle at any time regardless of onBoard status', async ({ page }) => {
    // Try to score 400 points (not enough to get on board)
    await page.getByRole('button', { name: 'One', exact: true }).click()
    await page.getByRole('button', { name: 'One', exact: true }).click()
    await page.getByRole('button', { name: 'One', exact: true }).click()
    await page.getByRole('button', { name: 'One', exact: true }).click()
    await expect(page.locator('h5:has-text("Turn Total:")')).toContainText('Turn Total: 400')

    // Click Farkle - should work even though not on board
    await page.getByRole('button', { name: 'Farkle!', exact: true }).click()

    // Should rotate to Bob
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()

    // Alice's score should still be 0
    const scoreboard = page.locator('.list__tile')
    await expect(scoreboard.nth(0).locator('.list__tile__action')).toContainText('0')
    await expect(scoreboard.nth(0)).toContainText('Not On Board')
  })

  test('tracks onBoard status independently for each player', async ({ page }) => {
    // Alice gets on board with 500 points
    await page.getByRole('button', { name: '555', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Verify Alice is on board, Bob is not
    const scoreboard = page.locator('.list__tile')
    await expect(scoreboard.nth(0)).toContainText('On Board')
    await expect(scoreboard.nth(1)).toContainText('Not On Board')

    // Bob's turn - should still show warning
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()
    const pageText = await page.textContent('body')
    expect(pageText).toContain('Not on board yet!')

    // Bob tries to bank less than 500
    await page.getByRole('button', { name: 'One', exact: true }).click()
    await page.getByRole('button', { name: 'Five', exact: true }).click()

    // Set up dialog handler
    page.once('dialog', async dialog => {
      expect(dialog.message()).toBe('You need 500 points to get on the board. Keep rolling or Farkle!')
      await dialog.accept()
    })

    // Should be prevented
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Still Bob's turn
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()
  })

  test('game restart resets onBoard status', async ({ page }) => {
    // Alice gets on board
    await page.getByRole('button', { name: '555', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Verify Alice is on board
    const scoreboard = page.locator('.list__tile')
    await expect(scoreboard.nth(0)).toContainText('On Board')
    await expect(scoreboard.nth(0).locator('.list__tile__action')).toContainText('500')

    // Restart game
    await page.getByRole('button', { name: 'Restart Game', exact: true }).click()

    // Should be back at setup screen
    await expect(page.locator('button:has-text("Start Game")')).toBeVisible()

    // Start game again
    await page.locator('button:has-text("Start Game")').click()

    // Both players should be "Not On Board" again with score 0
    await expect(scoreboard.nth(0)).toContainText('Not On Board')
    await expect(scoreboard.nth(0).locator('.list__tile__action')).toContainText('0')
    await expect(scoreboard.nth(1)).toContainText('Not On Board')
    await expect(scoreboard.nth(1).locator('.list__tile__action')).toContainText('0')

    // Should show warning again
    const pageText = await page.textContent('body')
    expect(pageText).toContain('Not on board yet!')
  })
})
