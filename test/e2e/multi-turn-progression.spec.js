import { test, expect } from '@playwright/test'

test.describe('Multi-Turn Game Progression', () => {
  test('completes 3 full turns with 2 players and verifies score accumulation', async ({ page }) => {
    await page.goto('/')

    // Setup 2 players
    const nameInput = page.locator('input[type="text"]')
    await nameInput.fill('Alice')
    await page.locator('button:has-text("Add")').click()
    await nameInput.fill('Bob')
    await page.locator('button:has-text("Add")').click()
    await page.locator('button:has-text("Start Game")').click()

    const scoreTiles = page.locator('.list__tile')

    // Turn 1: Alice scores 150
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()
    await page.getByRole('button', { name: 'One', exact: true }).click()
    await page.getByRole('button', { name: 'Five', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('150')

    // Turn 2: Bob scores 200
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()
    await page.getByRole('button', { name: '222', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(1).locator('.list__tile__action')).toContainText('200')

    // Turn 3: Alice scores another 100 (total: 250)
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()
    await page.getByRole('button', { name: 'One', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('250')

    // Turn 4: Bob scores another 300 (total: 500)
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()
    await page.getByRole('button', { name: '333', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(1).locator('.list__tile__action')).toContainText('500')

    // Turn 5: Alice scores another 50 (total: 300)
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()
    await page.getByRole('button', { name: 'Five', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('300')

    // Turn 6: Bob scores another 100 (total: 600)
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()
    await page.getByRole('button', { name: 'One', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(1).locator('.list__tile__action')).toContainText('600')

    // Verify rotation continues - should be Alice's turn
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()

    // Final score verification
    await expect(scoreTiles.nth(0).locator('.list__tile__title')).toContainText('Alice')
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('300')
    await expect(scoreTiles.nth(1).locator('.list__tile__title')).toContainText('Bob')
    await expect(scoreTiles.nth(1).locator('.list__tile__action')).toContainText('600')
  })

  test('completes 4 full turns with 3 players and verifies rotation cycles', async ({ page }) => {
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

    // Round 1: Each player takes one turn
    // Alice turn 1
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()
    await page.getByRole('button', { name: 'One', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Bob turn 1
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()
    await page.getByRole('button', { name: 'Five', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Charlie turn 1
    await expect(page.locator('text=Current Player: Charlie')).toBeVisible()
    await page.getByRole('button', { name: '111', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Verify rotation back to Alice
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()

    // Round 2: Each player takes second turn
    // Alice turn 2
    await page.getByRole('button', { name: 'Five', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Bob turn 2
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()
    await page.getByRole('button', { name: 'One', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Charlie turn 2
    await expect(page.locator('text=Current Player: Charlie')).toBeVisible()
    await page.getByRole('button', { name: '222', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Verify rotation back to Alice
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()

    // Round 3: Each player takes third turn
    // Alice turn 3
    await page.getByRole('button', { name: 'One', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Bob turn 3
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()
    await page.getByRole('button', { name: 'Five', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Charlie turn 3
    await expect(page.locator('text=Current Player: Charlie')).toBeVisible()
    await page.getByRole('button', { name: '333', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Verify rotation back to Alice
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()

    // Round 4: Each player takes fourth turn
    // Alice turn 4
    await page.getByRole('button', { name: 'Five', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Bob turn 4
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()
    await page.getByRole('button', { name: 'One', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Charlie turn 4
    await expect(page.locator('text=Current Player: Charlie')).toBeVisible()
    await page.getByRole('button', { name: '444', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Verify rotation continues to Alice
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()

    // Verify final scores
    // Alice: 100 + 50 + 100 + 50 = 300
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('300')
    // Bob: 50 + 100 + 50 + 100 = 300
    await expect(scoreTiles.nth(1).locator('.list__tile__action')).toContainText('300')
    // Charlie: 300 + 200 + 300 + 400 = 1200
    await expect(scoreTiles.nth(2).locator('.list__tile__action')).toContainText('1200')
  })

  test('mixed turns with scores and farkles maintains accurate scoreboard', async ({ page }) => {
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

    // Alice scores 100
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()
    await page.getByRole('button', { name: 'One', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('100')

    // Bob farkles (stays at 0)
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()
    await page.getByRole('button', { name: 'Five', exact: true }).click()
    await page.getByRole('button', { name: 'Farkle!', exact: true }).click()
    await expect(scoreTiles.nth(1).locator('.list__tile__action')).toContainText('0')

    // Charlie scores 300
    await expect(page.locator('text=Current Player: Charlie')).toBeVisible()
    await page.getByRole('button', { name: '333', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(2).locator('.list__tile__action')).toContainText('300')

    // Round 2: Alice farkles (stays at 100)
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()
    await page.getByRole('button', { name: 'One', exact: true }).click()
    await page.getByRole('button', { name: 'Farkle!', exact: true }).click()
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('100')

    // Bob scores 200 (total: 200)
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()
    await page.getByRole('button', { name: '222', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(1).locator('.list__tile__action')).toContainText('200')

    // Charlie scores 50 (total: 350)
    await expect(page.locator('text=Current Player: Charlie')).toBeVisible()
    await page.getByRole('button', { name: 'Five', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(2).locator('.list__tile__action')).toContainText('350')

    // Round 3: Alice scores 100 (total: 200)
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()
    await page.getByRole('button', { name: 'One', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('200')

    // Bob farkles (stays at 200)
    await expect(page.locator('text=Current Player: Bob')).toBeVisible()
    await page.getByRole('button', { name: 'One', exact: true }).click()
    await page.getByRole('button', { name: 'Farkle!', exact: true }).click()
    await expect(scoreTiles.nth(1).locator('.list__tile__action')).toContainText('200')

    // Charlie farkles (stays at 350)
    await expect(page.locator('text=Current Player: Charlie')).toBeVisible()
    await page.getByRole('button', { name: 'Five', exact: true }).click()
    await page.getByRole('button', { name: 'Farkle!', exact: true }).click()
    await expect(scoreTiles.nth(2).locator('.list__tile__action')).toContainText('350')

    // Verify rotation and final scores
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('200')
    await expect(scoreTiles.nth(1).locator('.list__tile__action')).toContainText('200')
    await expect(scoreTiles.nth(2).locator('.list__tile__action')).toContainText('350')
  })

  test('long game progression with 4 players over 5 rounds', async ({ page }) => {
    await page.goto('/')

    // Setup 4 players
    const nameInput = page.locator('input[type="text"]')
    const players = ['Alice', 'Bob', 'Charlie', 'Dave']
    for (const playerName of players) {
      await nameInput.fill(playerName)
      await page.locator('button:has-text("Add")').click()
    }
    await page.locator('button:has-text("Start Game")').click()

    const scoreTiles = page.locator('.list__tile')

    // 5 rounds, each player plays once per round
    const rounds = [
      // Round 1
      [
        { player: 'Alice', action: () => page.getByRole('button', { name: 'One', exact: true }).click(), expected: '100' },
        { player: 'Bob', action: () => page.getByRole('button', { name: 'Five', exact: true }).click(), expected: '50' },
        { player: 'Charlie', action: () => page.getByRole('button', { name: '111', exact: true }).click(), expected: '300' },
        { player: 'Dave', action: () => page.getByRole('button', { name: '222', exact: true }).click(), expected: '200' }
      ],
      // Round 2
      [
        { player: 'Alice', action: () => page.getByRole('button', { name: 'Five', exact: true }).click(), expected: '150' },
        { player: 'Bob', action: () => page.getByRole('button', { name: 'One', exact: true }).click(), expected: '150' },
        { player: 'Charlie', action: () => page.getByRole('button', { name: '333', exact: true }).click(), expected: '600' },
        { player: 'Dave', action: () => page.getByRole('button', { name: '444', exact: true }).click(), expected: '600' }
      ],
      // Round 3
      [
        { player: 'Alice', action: () => page.getByRole('button', { name: 'One', exact: true }).click(), expected: '250' },
        { player: 'Bob', action: () => page.getByRole('button', { name: 'Five', exact: true }).click(), expected: '200' },
        { player: 'Charlie', action: () => page.getByRole('button', { name: '555', exact: true }).click(), expected: '1100' },
        { player: 'Dave', action: () => page.getByRole('button', { name: '666', exact: true }).click(), expected: '1200' }
      ],
      // Round 4
      [
        { player: 'Alice', action: () => page.getByRole('button', { name: 'Five', exact: true }).click(), expected: '300' },
        { player: 'Bob', action: () => page.getByRole('button', { name: 'One', exact: true }).click(), expected: '300' },
        { player: 'Charlie', action: () => page.getByRole('button', { name: 'One', exact: true }).click(), expected: '1200' },
        { player: 'Dave', action: () => page.getByRole('button', { name: 'Five', exact: true }).click(), expected: '1250' }
      ],
      // Round 5
      [
        { player: 'Alice', action: () => page.getByRole('button', { name: 'One', exact: true }).click(), expected: '400' },
        { player: 'Bob', action: () => page.getByRole('button', { name: 'Five', exact: true }).click(), expected: '350' },
        { player: 'Charlie', action: () => page.getByRole('button', { name: 'Five', exact: true }).click(), expected: '1250' },
        { player: 'Dave', action: () => page.getByRole('button', { name: 'One', exact: true }).click(), expected: '1350' }
      ]
    ]

    for (let roundIndex = 0; roundIndex < rounds.length; roundIndex++) {
      const round = rounds[roundIndex]
      for (let playerIndex = 0; playerIndex < round.length; playerIndex++) {
        const turn = round[playerIndex]

        // Verify current player
        await expect(page.locator(`text=Current Player: ${turn.player}`)).toBeVisible()

        // Execute action
        await turn.action()
        await page.getByRole('button', { name: 'Done', exact: true }).click()

        // Verify score
        await expect(scoreTiles.nth(playerIndex).locator('.list__tile__action')).toContainText(turn.expected)
      }
    }

    // After 5 complete rounds, should be back to Alice
    await expect(page.locator('text=Current Player: Alice')).toBeVisible()

    // Verify all final scores
    await expect(scoreTiles.nth(0).locator('.list__tile__action')).toContainText('400')
    await expect(scoreTiles.nth(1).locator('.list__tile__action')).toContainText('350')
    await expect(scoreTiles.nth(2).locator('.list__tile__action')).toContainText('1250')
    await expect(scoreTiles.nth(3).locator('.list__tile__action')).toContainText('1350')
  })

  test('scoreboard displays correct player names throughout game', async ({ page }) => {
    await page.goto('/')

    // Setup players with specific names
    const nameInput = page.locator('input[type="text"]')
    await nameInput.fill('PlayerOne')
    await page.locator('button:has-text("Add")').click()
    await nameInput.fill('PlayerTwo')
    await page.locator('button:has-text("Add")').click()
    await nameInput.fill('PlayerThree')
    await page.locator('button:has-text("Add")').click()
    await page.locator('button:has-text("Start Game")').click()

    const scoreTiles = page.locator('.list__tile')

    // Verify names are correct initially
    await expect(scoreTiles.nth(0).locator('.list__tile__title')).toContainText('PlayerOne')
    await expect(scoreTiles.nth(1).locator('.list__tile__title')).toContainText('PlayerTwo')
    await expect(scoreTiles.nth(2).locator('.list__tile__title')).toContainText('PlayerThree')

    // Play a few turns
    await page.getByRole('button', { name: 'One', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    await page.getByRole('button', { name: 'Five', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    await page.getByRole('button', { name: '111', exact: true }).click()
    await page.getByRole('button', { name: 'Done', exact: true }).click()

    // Verify names remain correct after turns
    await expect(scoreTiles.nth(0).locator('.list__tile__title')).toContainText('PlayerOne')
    await expect(scoreTiles.nth(1).locator('.list__tile__title')).toContainText('PlayerTwo')
    await expect(scoreTiles.nth(2).locator('.list__tile__title')).toContainText('PlayerThree')

    // Verify names maintain order in scoreboard
    const titles = scoreTiles.locator('.list__tile__title')
    await expect(titles.nth(0)).toContainText('PlayerOne')
    await expect(titles.nth(1)).toContainText('PlayerTwo')
    await expect(titles.nth(2)).toContainText('PlayerThree')
  })
})
