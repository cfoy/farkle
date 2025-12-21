import { test, expect } from '@playwright/test'

test.describe('Special Scoring Combinations', () => {
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

  test('Four of a Kind scores 1000 points', async ({ page }) => {
    // Click Four of a Kind button
    await page.getByRole('button', { name: 'Four of a Kind', exact: true }).click()

    // Verify points accumulated
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 1000')

    // Complete turn
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Verify score updated
    const scoreTiles = page.locator('.list__tile')
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('1000')
  })

  test('Five of a Kind scores 2000 points', async ({ page }) => {
    // Click Five of a Kind button
    await page.getByRole('button', { name: 'Five of a Kind', exact: true }).click()

    // Verify points accumulated
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 2000')

    // Complete turn
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Verify score updated
    const scoreTiles = page.locator('.list__tile')
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('2000')
  })

  test('Six of a Kind scores 3000 points', async ({ page }) => {
    // Click Six of a Kind button
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()

    // Verify points accumulated
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 3000')

    // Complete turn
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Verify score updated
    const scoreTiles = page.locator('.list__tile')
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('3000')
  })

  test('Straight scores 1500 points', async ({ page }) => {
    // Click Straight button
    await page.getByRole('button', { name: 'Straight', exact: true }).click()

    // Verify points accumulated
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 1500')

    // Complete turn
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Verify score updated
    const scoreTiles = page.locator('.list__tile')
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('1500')
  })

  test('Three Pairs scores 1500 points', async ({ page }) => {
    // Click Three Pairs button
    await page.getByRole('button', { name: 'Three Pairs', exact: true }).click()

    // Verify points accumulated
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 1500')

    // Complete turn
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Verify score updated
    const scoreTiles = page.locator('.list__tile')
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('1500')
  })

  test('Four of a Kind Plus a Pair scores 1500 points', async ({ page }) => {
    // Click Four of a Kind Plus a Pair button
    await page.getByRole('button', { name: 'Four of a Kind Plus a Pair', exact: true }).click()

    // Verify points accumulated
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 1500')

    // Complete turn
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Verify score updated
    const scoreTiles = page.locator('.list__tile')
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('1500')
  })

  test('Three of a Kind x 2 scores 2500 points', async ({ page }) => {
    // Click Three of a Kind x 2 button
    await page.getByRole('button', { name: 'Three of a Kind x 2', exact: true }).click()

    // Verify points accumulated
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 2500')

    // Complete turn
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Verify score updated
    const scoreTiles = page.locator('.list__tile')
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('2500')
  })

  test('combining multiple special scoring combinations in one turn', async ({ page }) => {
    // Click Four of a Kind (1000) + Three Pairs (1500) = 2500
    await page.getByRole('button', { name: 'Four of a Kind', exact: true }).click()
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 1000')

    await page.getByRole('button', { name: 'Three Pairs', exact: true }).click()
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 2500')

    // Complete turn
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Verify score updated
    const scoreTiles = page.locator('.list__tile')
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('2500')
  })

  test('combining special scoring with basic scoring buttons', async ({ page }) => {
    // Click Six of a Kind (3000) + One (100) + Five (50) = 3150
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 3000')

    await page.getByRole('button', { name: 'One', exact: true }).click()
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 3100')

    await page.getByRole('button', { name: 'Five', exact: true }).click()
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 3150')

    // Complete turn
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Verify score updated
    const scoreTiles = page.locator('.list__tile')
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('3150')
  })

  test('combining special scoring with triple combinations', async ({ page }) => {
    // Click Straight (1500) + 111 (300) + 222 (200) = 2000
    await page.getByRole('button', { name: 'Straight', exact: true }).click()
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 1500')

    await page.getByRole('button', { name: '111', exact: true }).click()
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 1800')

    await page.getByRole('button', { name: '222', exact: true }).click()
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 2000')

    // Complete turn
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Verify score updated
    const scoreTiles = page.locator('.list__tile')
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('2000')
  })

  test('special scoring combinations persist across multiple turns', async ({ page }) => {
    const scoreTiles = page.locator('.list__tile')

    // Alice turn 1: Four of a Kind (1000)
    await page.getByRole('button', { name: 'Four of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('1000')

    // Bob turn 1: Straight (1500)
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()
    await page.getByRole('button', { name: 'Straight', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(1).locator('.list__tile__action')).toContainText('1500')

    // Alice turn 2: Three Pairs (1500) - total: 2500
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()
    await page.getByRole('button', { name: 'Three Pairs', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('2500')

    // Bob turn 2: Five of a Kind (2000) - total: 3500
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()
    await page.getByRole('button', { name: 'Five of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(1).locator('.list__tile__action')).toContainText('3500')

    // Alice turn 3: Six of a Kind (3000) - total: 5500
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('5500')

    // Bob turn 3: Three of a Kind x 2 (2500) - total: 6000
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()
    await page.getByRole('button', { name: 'Three of a Kind x 2', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(1).locator('.list__tile__action')).toContainText('6000')
  })

  test('farkle resets special scoring points', async ({ page }) => {
    // Accumulate special scoring points
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Five of a Kind', exact: true }).click()
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 5000')

    // Farkle
    await page.getByRole('button', { name: 'Farkle!', exact: true }).click()

    // Verify score not added
    const scoreTiles = page.locator('.list__tile')
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('0')

    // Verify next player
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()
  })

  test('high scoring combination with maximum points in single turn', async ({ page }) => {
    // Maximize points: Six of a Kind (3000) + Five of a Kind (2000) + Four of a Kind (1000) = 6000
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 3000')

    await page.getByRole('button', { name: 'Five of a Kind', exact: true }).click()
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 5000')

    await page.getByRole('button', { name: 'Four of a Kind', exact: true }).click()
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 6000')

    // Add more combinations
    await page.getByRole('button', { name: 'Straight', exact: true }).click()
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 7500')

    await page.getByRole('button', { name: 'Three of a Kind x 2', exact: true }).click()
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 10000')

    // Complete turn
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Verify massive score
    const scoreTiles = page.locator('.list__tile')
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('10000')
  })

  test('all 1500-point combinations score correctly', async ({ page }) => {
    const scoreTiles = page.locator('.list__tile')

    // Test Straight = 1500
    await page.getByRole('button', { name: 'Straight', exact: true }).click()
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 1500')
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('1500')

    // Bob: Test Three Pairs = 1500
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()
    await page.getByRole('button', { name: 'Three Pairs', exact: true }).click()
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 1500')
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(1).locator('.list__tile__action')).toContainText('1500')

    // Alice: Test Four of a Kind Plus a Pair = 1500 (total: 3000)
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()
    await page.getByRole('button', { name: 'Four of a Kind Plus a Pair', exact: true }).click()
    await expect(page.locator('h5:has-text("Points:")')).toContainText('Points: 1500')
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('3000')

    // Verify all three 1500-point combinations work
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('3000')
    await expect(scoreTiles.nth(1).locator('.list__tile__action')).toContainText('1500')
  })
})
