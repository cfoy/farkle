import { test, expect } from '@playwright/test'

test.describe('Win Tracking', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Clear localStorage before each test to ensure clean state
    await page.evaluate(() => {
      localStorage.clear()
    })
  })

  test('tracks wins across multiple games with localStorage persistence', async ({ page }) => {
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

    // ========== GAME 1: Alice wins ==========
    // Alice turn: Six of a Kind x 3 + Four of a Kind = 10,000
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Four of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('10000')

    // Bob turn: Get on board with 555 (500)
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()
    await page.getByRole('button', { name: '555', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(1).locator('.list__tile__action')).toContainText('500')

    // Charlie turn: Get on board with 666 (600)
    await expect(page.locator('text=Current Player: Charlie')).toBeVisible()
    await page.getByRole('button', { name: '666', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(2).locator('.list__tile__action')).toContainText('600')

    // Verify game over
    await expect(page.locator('text=Game Over!')).toBeVisible()
    await expect(page.locator('h4')).toContainText('Winner: Alice')
    await expect(page.locator('h4')).toContainText('10000 points')

    // Verify Alice's win count is displayed (should be 1)
    await expect(page.locator('.win-count')).toBeVisible()
    await expect(page.locator('.win-count')).toContainText('Total Wins: 1')

    // Verify localStorage has the win data
    const storedWins1 = await page.evaluate(() => {
      return localStorage.getItem('farkle-wins')
    })
    expect(storedWins1).toBeTruthy()
    const winsData1 = JSON.parse(storedWins1)
    expect(winsData1.Alice).toBe(1)
    expect(winsData1.Bob).toBe(0)
    expect(winsData1.Charlie).toBe(0)

    // ========== RESTART AND PLAY GAME 2: Bob wins ==========
    await page.locator('button:has-text("Restart Game")').click()

    // Verify back to setup view
    await expect(page.locator('label:has-text("Name")')).toBeVisible()
    await expect(page.locator('button:has-text("Start Game")')).toBeVisible()

    // Verify players still have their names
    await expect(page.locator('text=Alice')).toBeVisible()
    await expect(page.locator('text=Bob')).toBeVisible()
    await expect(page.locator('text=Charlie')).toBeVisible()

    // Start second game
    await page.locator('button:has-text("Start Game")').click()

    // Verify scores are reset to 0
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('0')
    await expect(scoreTiles.nth(1).locator('.list__tile__action')).toContainText('0')
    await expect(scoreTiles.nth(2).locator('.list__tile__action')).toContainText('0')

    // Alice turn: Get on board with 555 (500)
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()
    await page.getByRole('button', { name: '555', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Bob turn: Six of a Kind x 3 + Four of a Kind = 10,000 (Bob wins this time)
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Four of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(1).locator('.list__tile__action')).toContainText('10000')

    // Charlie turn: Get on board with 555 (500)
    await expect(page.locator('text=Current Player: Charlie')).toBeVisible()
    await page.getByRole('button', { name: '555', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Verify Bob wins game 2
    await expect(page.locator('text=Game Over!')).toBeVisible()
    await expect(page.locator('h4')).toContainText('Winner: Bob')
    await expect(page.locator('h4')).toContainText('10000 points')

    // Verify Bob's win count is displayed (should be 1)
    await expect(page.locator('.win-count')).toContainText('Total Wins: 1')

    // Verify localStorage has updated win data
    const storedWins2 = await page.evaluate(() => {
      return localStorage.getItem('farkle-wins')
    })
    expect(storedWins2).toBeTruthy()
    const winsData2 = JSON.parse(storedWins2)
    expect(winsData2.Alice).toBe(1) // Alice still has 1 win from game 1
    expect(winsData2.Bob).toBe(1)   // Bob now has 1 win from game 2
    expect(winsData2.Charlie).toBe(0) // Charlie still has 0 wins

    // ========== RESTART AND PLAY GAME 3: Alice wins again ==========
    await page.locator('button:has-text("Restart Game")').click()
    await page.locator('button:has-text("Start Game")').click()

    // Alice turn: Six of a Kind x 3 + Four of a Kind = 10,000 (Alice wins again)
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Four of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Bob turn: Get on board
    await page.getByRole('button', { name: '555', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Charlie turn: Get on board
    await page.getByRole('button', { name: '555', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Verify Alice wins game 3
    await expect(page.locator('text=Game Over!')).toBeVisible()
    await expect(page.locator('h4')).toContainText('Winner: Alice')

    // Verify Alice's win count incremented to 2
    await expect(page.locator('.win-count')).toContainText('Total Wins: 2')

    // Verify localStorage has final win data
    const storedWins3 = await page.evaluate(() => {
      return localStorage.getItem('farkle-wins')
    })
    expect(storedWins3).toBeTruthy()
    const winsData3 = JSON.parse(storedWins3)
    expect(winsData3.Alice).toBe(2)   // Alice now has 2 wins
    expect(winsData3.Bob).toBe(1)     // Bob still has 1 win
    expect(winsData3.Charlie).toBe(0) // Charlie still has 0 wins
  })

  test('wins persist after page reload', async ({ page }) => {
    // Setup players and play a game
    const nameInput = page.locator('input[type="text"]')
    await nameInput.fill('Alice')
    await page.locator('button:has-text("Add")').click()
    await nameInput.fill('Bob')
    await page.locator('button:has-text("Add")').click()
    await page.locator('button:has-text("Start Game")').click()

    // Alice wins quickly
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Four of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Bob gets on board
    await page.getByRole('button', { name: '555', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Verify Alice won
    await expect(page.locator('text=Game Over!')).toBeVisible()
    await expect(page.locator('.win-count')).toContainText('Total Wins: 1')

    // Reload the page
    await page.reload()

    // Add the same players again
    await nameInput.fill('Alice')
    await page.locator('button:has-text("Add")').click()
    await nameInput.fill('Bob')
    await page.locator('button:has-text("Add")').click()
    await page.locator('button:has-text("Start Game")').click()

    // Alice wins again
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Four of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    await page.getByRole('button', { name: '555', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Verify Alice's wins persisted from before reload (should be 2 now)
    await expect(page.locator('text=Game Over!')).toBeVisible()
    await expect(page.locator('.win-count')).toContainText('Total Wins: 2')

    // Verify localStorage has correct data
    const storedWins = await page.evaluate(() => {
      return localStorage.getItem('farkle-wins')
    })
    const winsData = JSON.parse(storedWins)
    expect(winsData.Alice).toBe(2)
    expect(winsData.Bob).toBe(0)
  })

  test('new player starts with 0 wins', async ({ page }) => {
    // Set up localStorage with existing win data for Alice
    await page.evaluate(() => {
      localStorage.setItem('farkle-wins', JSON.stringify({ Alice: 5 }))
    })

    // Add Alice and a new player Bob
    const nameInput = page.locator('input[type="text"]')
    await nameInput.fill('Alice')
    await page.locator('button:has-text("Add")').click()
    await nameInput.fill('Bob')
    await page.locator('button:has-text("Add")').click()
    await page.locator('button:has-text("Start Game")').click()

    // Bob wins
    await page.getByRole('button', { name: '555', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Four of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Verify Bob (new player) has 1 win
    await expect(page.locator('text=Game Over!')).toBeVisible()
    await expect(page.locator('h4')).toContainText('Winner: Bob')
    await expect(page.locator('.win-count')).toContainText('Total Wins: 1')

    // Verify localStorage has correct data
    const storedWins = await page.evaluate(() => {
      return localStorage.getItem('farkle-wins')
    })
    const winsData = JSON.parse(storedWins)
    expect(winsData.Alice).toBe(5) // Alice still has 5 wins
    expect(winsData.Bob).toBe(1)   // Bob now has 1 win
  })

  test('multiple winners accumulate wins correctly', async ({ page }) => {
    const nameInput = page.locator('input[type="text"]')
    await nameInput.fill('Alice')
    await page.locator('button:has-text("Add")').click()
    await nameInput.fill('Bob')
    await page.locator('button:has-text("Add")').click()
    await nameInput.fill('Charlie')
    await page.locator('button:has-text("Add")').click()

    // Helper function to play a quick game with a specific winner
    const playGameWithWinner = async (winnerIndex) => {
      await page.locator('button:has-text("Start Game")').click()

      // All players take turns, winner gets to 10k
      for (let i = 0; i < 3; i++) {
        if (i === winnerIndex) {
          // Winner scores 10,000
          await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
          await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
          await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
          await page.getByRole('button', { name: 'Four of a Kind', exact: true }).click()
        } else {
          // Other players just get on board
          await page.getByRole('button', { name: '555', exact: true }).click()
        }
        await page.getByRole('button', { name: 'Done', exact: true }).click()
      }

      await expect(page.locator('text=Game Over!')).toBeVisible()
      await page.locator('button:has-text("Restart Game")').click()
    }

    // Play 5 games: Alice wins 2, Bob wins 2, Charlie wins 1
    await playGameWithWinner(0) // Alice wins
    await playGameWithWinner(1) // Bob wins
    await playGameWithWinner(0) // Alice wins
    await playGameWithWinner(2) // Charlie wins
    await playGameWithWinner(1) // Bob wins

    // Play final game to verify win counts
    await page.locator('button:has-text("Start Game")').click()

    // Alice wins this one
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Six of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Four of a Kind', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    await page.getByRole('button', { name: '555', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    await page.getByRole('button', { name: '555', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Verify Alice's total wins
    await expect(page.locator('text=Game Over!')).toBeVisible()
    await expect(page.locator('h4')).toContainText('Winner: Alice')
    await expect(page.locator('.win-count')).toContainText('Total Wins: 3')

    // Verify localStorage has all win data
    const storedWins = await page.evaluate(() => {
      return localStorage.getItem('farkle-wins')
    })
    const winsData = JSON.parse(storedWins)
    expect(winsData.Alice).toBe(3)
    expect(winsData.Bob).toBe(2)
    expect(winsData.Charlie).toBe(1)
  })
})
