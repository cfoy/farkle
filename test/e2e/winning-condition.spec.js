import { test, expect } from '@playwright/test'

test.describe('Winning Condition - 10,000 Point Game', () => {
  test('complete game: player reaches 10k, others get final turns, winner displayed', async ({ page }) => {
    await page.goto('/')

    // Setup 3 players
    const nameInput = page.locator('input[type="text"]')
    await nameInput.fill('Alice')
    await page.locator('button:has-text("Add")').click()
    await nameInput.fill('Bob')
    await page.locator('button:has-text("Add")').click()
    await nameInput.fill('Charlie')
    await page.locator('button:has-text("Add")').click()
    await page.locator('button:has-text("Start Game")').click()

    const scoreTiles = page.locator('.list__tile')

    // Round 1: Build up Alice's score
    // Alice turn 1: Six of a Kind (3000)
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('3000')

    // Bob turn 1: Get on board with 555 (500)
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()
    await page.getByRole('button', { name: '555', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(1).locator('.list__tile__action')).toContainText('500')

    // Charlie turn 1: Get on board with 500
    await expect(page.locator('text=Current Player: Charlie')).toBeVisible()
    await page.getByRole('button', { name: '555', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(2).locator('.list__tile__action')).toContainText('500')

    // Round 2: Continue building Alice's score
    // Alice turn 2: Six of a Kind (3000) - total: 6000
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('6000')

    // Bob turn 2: 333 (300) - total: 800
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()
    await page.getByRole('button', { name: '333', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(1).locator('.list__tile__action')).toContainText('800')

    // Charlie turn 2: 444 (400) - total: 900
    await expect(page.locator('text=Current Player: Charlie')).toBeVisible()
    await page.getByRole('button', { name: '444', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(2).locator('.list__tile__action')).toContainText('900')

    // Round 3: Get Alice close to 10,000
    // Alice turn 3: Six of a Kind (3000) - total: 9000
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('9000')

    // Bob turn 3: 555 (500) - total: 1300
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()
    await page.getByRole('button', { name: '555', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(1).locator('.list__tile__action')).toContainText('1300')

    // Charlie turn 3: 666 (600) - total: 1500
    await expect(page.locator('text=Current Player: Charlie')).toBeVisible()
    await page.getByRole('button', { name: '666', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(2).locator('.list__tile__action')).toContainText('1500')

    // Round 4: Alice reaches 10,000 - TRIGGERS LAST ROUND
    // Alice turn 4: Four of a Kind (1000) - total: 10,000
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()
    await page.getByRole('button', { name: 'Four of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('10000')

    // Game should NOT be over yet - Bob and Charlie still get final turns
    await expect(page.locator('text=Game Over!')).not.toBeVisible()
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()

    // Bob turn 4 (LAST ROUND): Five of a Kind (2000) - total: 3300
    await page.getByRole('button', { name: 'Five of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(1).locator('.list__tile__action')).toContainText('3300')

    // Game should STILL not be over - Charlie needs final turn
    await expect(page.locator('text=Game Over!')).not.toBeVisible()
    await expect(page.locator('text=Current Player: Charlie')).toBeVisible()

    // Charlie turn 4 (LAST ROUND): Straight (1500) - total: 3000
    await page.getByRole('button', { name: 'Straight', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(2).locator('.list__tile__action')).toContainText('3000')

    // NOW game should be over - all players had equal turns
    await expect(page.locator('text=Game Over!')).toBeVisible()

    // Verify winner is displayed correctly
    await expect(page.locator('h4')).toContainText('Winner: Alice')
    await expect(page.locator('h4')).toContainText('10000 points')

    // Verify game UI is hidden (no more "Current Player" display)
    await expect(page.locator('text=Current Player:')).not.toBeVisible()

    // Verify turn buttons are hidden
    await expect(page.getByRole('button', { name: 'Done', exact: true })).not.toBeVisible()

    // Verify final scoreboard is still visible
    await expect(scoreTiles.nth(0).locator('.list__tile__title')).toContainText('Alice')
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('10000')
    await expect(scoreTiles.nth(1).locator('.list__tile__title')).toContainText('Bob')
    await expect(scoreTiles.nth(1).locator('.list__tile__action')).toContainText('3300')
    await expect(scoreTiles.nth(2).locator('.list__tile__title')).toContainText('Charlie')
    await expect(scoreTiles.nth(2).locator('.list__tile__action')).toContainText('3000')
  })

  test('second player reaches 10k first, third player wins with higher score', async ({ page }) => {
    await page.goto('/')

    // Setup 3 players
    const nameInput = page.locator('input[type="text"]')
    await nameInput.fill('Alice')
    await page.locator('button:has-text("Add")').click()
    await nameInput.fill('Bob')
    await page.locator('button:has-text("Add")').click()
    await nameInput.fill('Charlie')
    await page.locator('button:has-text("Add")').click()
    await page.locator('button:has-text("Start Game")').click()

    const scoreTiles = page.locator('.list__tile')

    // Alice turn 1: 555 (500)
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()
    await page.getByRole('button', { name: '555', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Bob turn 1: Six of a Kind (3000)
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Charlie turn 1: 666 (600)
    await expect(page.locator('text=Current Player: Charlie')).toBeVisible()
    await page.getByRole('button', { name: '666', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Alice turn 2: 666 (600) - total: 1100
    await page.getByRole('button', { name: '666', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Bob turn 2: Six of a Kind (3000) - total: 6000
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Charlie turn 2: Six of a Kind (3000) - total: 3600
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Alice turn 3: 555 (500) - total: 1600
    await page.getByRole('button', { name: '555', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Bob turn 3: Six of a Kind (3000) - total: 9000
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Charlie turn 3: Six of a Kind (3000) - total: 6600
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Alice turn 4: 444 (400) - total: 2000
    await page.getByRole('button', { name: '444', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Bob turn 4: Four of a Kind (1000) - total: 10,000 (TRIGGERS LAST ROUND)
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()
    await page.getByRole('button', { name: 'Four of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(1).locator('.list__tile__action')).toContainText('10000')

    // Game should not be over - Charlie still gets final turn
    await expect(page.locator('text=Game Over!')).not.toBeVisible()

    // Charlie turn 4 (LAST ROUND): Six of a Kind (3000) + Five of a Kind (2000) - total: 11,600
    await expect(page.locator('text=Current Player: Charlie')).toBeVisible()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Five of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(2).locator('.list__tile__action')).toContainText('11600')

    // NOW game should be over
    await expect(page.locator('text=Game Over!')).toBeVisible()

    // Verify Charlie wins (highest score) even though Bob triggered the ending
    await expect(page.locator('h4')).toContainText('Winner: Charlie')
    await expect(page.locator('h4')).toContainText('11600 points')

    // Verify final scores
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('2000')
    await expect(scoreTiles.nth(1).locator('.list__tile__action')).toContainText('10000')
    await expect(scoreTiles.nth(2).locator('.list__tile__action')).toContainText('11600')
  })

  test('last player reaches 10k, game ends immediately', async ({ page }) => {
    await page.goto('/')

    // Setup 3 players
    const nameInput = page.locator('input[type="text"]')
    await nameInput.fill('Alice')
    await page.locator('button:has-text("Add")').click()
    await nameInput.fill('Bob')
    await page.locator('button:has-text("Add")').click()
    await nameInput.fill('Charlie')
    await page.locator('button:has-text("Add")').click()
    await page.locator('button:has-text("Start Game")').click()

    const scoreTiles = page.locator('.list__tile')

    // Alice turn 1: Get on board with 555 (500)
    await page.getByRole('button', { name: '555', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Bob turn 1: Get on board with 555 (500)
    await page.getByRole('button', { name: '555', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Charlie turn 1: Six of a Kind (3000) x 3 + Four of a Kind (1000) = 10,000
    await expect(page.locator('text=Current Player: Charlie')).toBeVisible()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Four of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(2).locator('.list__tile__action')).toContainText('10000')

    // Game should end immediately (last player in rotation, all had equal turns)
    await expect(page.locator('text=Game Over!')).toBeVisible()

    // Verify Charlie wins
    await expect(page.locator('h4')).toContainText('Winner: Charlie')
    await expect(page.locator('h4')).toContainText('10000 points')

    // Verify no "Current Player" display
    await expect(page.locator('text=Current Player:')).not.toBeVisible()
  })

  test('tie game: shows tie-breaker UI and allows winner selection', async ({ page }) => {
    await page.goto('/')

    // Setup 2 players
    const nameInput = page.locator('input[type="text"]')
    await nameInput.fill('Alice')
    await page.locator('button:has-text("Add")').click()
    await nameInput.fill('Bob')
    await page.locator('button:has-text("Add")').click()
    await page.locator('button:has-text("Start Game")').click()

    const scoreTiles = page.locator('.list__tile')

    // Build up scores to near 10,000
    // Alice turn 1: Six of a Kind x 3 = 9000
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Bob turn 1: Six of a Kind x 3 = 9000
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Alice turn 2: Four of a Kind (1000) = 10,000 (TRIGGERS LAST ROUND)
    await page.getByRole('button', { name: 'Four of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('10000')

    // Bob turn 2 (LAST ROUND): Four of a Kind (1000) = 10,000 (TIE)
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()
    await page.getByRole('button', { name: 'Four of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(1).locator('.list__tile__action')).toContainText('10000')

    // Verify tie-breaker UI is shown
    await expect(page.locator('text=It\'s a Tie!')).toBeVisible()
    await expect(page.locator('text=Roll a die to determine the winner!')).toBeVisible()

    // Verify NO normal game over UI yet
    await expect(page.locator('text=Game Over!')).not.toBeVisible()

    // Verify tie-breaker buttons are present with correct labels
    await expect(page.locator('button:has-text("Alice - 10000 points")')).toBeVisible()
    await expect(page.locator('button:has-text("Bob - 10000 points")')).toBeVisible()

    // Click Alice's button to select her as winner
    await page.locator('button:has-text("Alice - 10000 points")').click()

    // Now normal game over UI should appear
    await expect(page.locator('text=Game Over!')).toBeVisible()
    await expect(page.locator('h4')).toContainText('Winner: Alice')
    await expect(page.locator('h4')).toContainText('10000 points')

    // Tie-breaker UI should be hidden
    await expect(page.locator('text=It\'s a Tie!')).not.toBeVisible()
  })

  test('tie-breaker: three players tied, select winner', async ({ page }) => {
    await page.goto('/')

    // Setup 3 players
    const nameInput = page.locator('input[type="text"]')
    await nameInput.fill('Alice')
    await page.locator('button:has-text("Add")').click()
    await nameInput.fill('Bob')
    await page.locator('button:has-text("Add")').click()
    await nameInput.fill('Charlie')
    await page.locator('button:has-text("Add")').click()
    await page.locator('button:has-text("Start Game")').click()

    // Build all three players to 10,000
    // Alice: 10,000
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Four of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Bob: 10,000
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Four of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Charlie: 10,000
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Four of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Verify tie-breaker UI with all three players
    await expect(page.locator('text=It\'s a Tie!')).toBeVisible()
    await expect(page.locator('button:has-text("Alice - 10000 points")')).toBeVisible()
    await expect(page.locator('button:has-text("Bob - 10000 points")')).toBeVisible()
    await expect(page.locator('button:has-text("Charlie - 10000 points")')).toBeVisible()

    // Select Charlie as winner
    await page.locator('button:has-text("Charlie - 10000 points")').click()

    // Verify Charlie wins
    await expect(page.locator('text=Game Over!')).toBeVisible()
    await expect(page.locator('h4')).toContainText('Winner: Charlie')
  })

  test('no tie-breaker when one player clearly wins', async ({ page }) => {
    await page.goto('/')

    // Setup 3 players
    const nameInput = page.locator('input[type="text"]')
    await nameInput.fill('Alice')
    await page.locator('button:has-text("Add")').click()
    await nameInput.fill('Bob')
    await page.locator('button:has-text("Add")').click()
    await nameInput.fill('Charlie')
    await page.locator('button:has-text("Add")').click()
    await page.locator('button:has-text("Start Game")').click()

    // Alice: 12,000
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Bob: Get on board with 500
    await page.getByRole('button', { name: '555', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Charlie: Get on board with 500
    await page.getByRole('button', { name: '555', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Verify NO tie-breaker UI appears
    await expect(page.locator('text=It\'s a Tie!')).not.toBeVisible()

    // Verify normal game over with clear winner
    await expect(page.locator('text=Game Over!')).toBeVisible()
    await expect(page.locator('h4')).toContainText('Winner: Alice')
    await expect(page.locator('h4')).toContainText('12000 points')
  })
})
