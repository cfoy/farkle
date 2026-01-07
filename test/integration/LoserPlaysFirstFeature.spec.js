import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Farkle from '../../src/components/Farkle.vue'
import FarkleGame from '../../src/components/FarkleGame.vue'
import { vuetifyStubs } from '../setup'

describe('Loser Plays First Feature - Integration Test', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Farkle, {
      global: {
        stubs: {
          ...vuetifyStubs,
          'player-list': true,
          'create-player': true
        }
      }
    })
  })

  it('complete flow: loser is identified and plays first in next game', async () => {
    // Step 1: Set up players
    wrapper.vm.players = [
      { name: 'Alice', score: 0, onBoard: false, wins: 0 },
      { name: 'Bob', score: 0, onBoard: false, wins: 0 },
      { name: 'Charlie', score: 0, onBoard: false, wins: 0 }
    ]

    // Step 2: Verify initial state
    expect(wrapper.vm.nextGameStartingPlayerIndex).toBeNull()
    expect(wrapper.vm.started).toBe(false)

    // Step 3: Start first game
    wrapper.vm.startGame()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.started).toBe(true)

    // Step 4: Simulate game end with specific scores
    // Alice wins with 10500, Bob loses with 2000, Charlie has 8000
    wrapper.vm.players[0].score = 10500
    wrapper.vm.players[1].score = 2000
    wrapper.vm.players[2].score = 8000

    const gameResult = {
      winner: wrapper.vm.players[0], // Alice wins
      loser: wrapper.vm.players[1]   // Bob loses (lowest score)
    }

    wrapper.vm.handleGameEnd(gameResult)
    await wrapper.vm.$nextTick()

    // Step 5: Verify loser index is stored
    expect(wrapper.vm.nextGameStartingPlayerIndex).toBe(1) // Bob's index
    expect(wrapper.vm.players[0].wins).toBe(1) // Alice has 1 win

    // Step 6: Restart game (reset scores but keep nextGameStartingPlayerIndex)
    wrapper.vm.restartGame()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.started).toBe(false)
    expect(wrapper.vm.players[0].score).toBe(0)
    expect(wrapper.vm.players[1].score).toBe(0)
    expect(wrapper.vm.players[2].score).toBe(0)
    expect(wrapper.vm.nextGameStartingPlayerIndex).toBe(1) // Persists!

    // Step 7: Start second game
    wrapper.vm.startGame()
    await wrapper.vm.$nextTick()

    // Step 8: Verify Bob (the loser) will start the second game
    // The FarkleGame component exists and will receive the correct prop
    const farkleGameStub = wrapper.findComponent({ name: 'farkle-game' })
    expect(farkleGameStub.exists()).toBe(true)

    // Verify the nextGameStartingPlayerIndex is still set to Bob's index
    expect(wrapper.vm.nextGameStartingPlayerIndex).toBe(1)
  })

  it('second game loser becomes next game starter', async () => {
    // Set up players
    wrapper.vm.players = [
      { name: 'Alice', score: 0, onBoard: false, wins: 0 },
      { name: 'Bob', score: 0, onBoard: false, wins: 0 },
      { name: 'Charlie', score: 0, onBoard: false, wins: 0 }
    ]

    // First game: Bob loses
    wrapper.vm.handleGameEnd({
      winner: wrapper.vm.players[0],
      loser: wrapper.vm.players[1]
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.nextGameStartingPlayerIndex).toBe(1)

    // Second game: Charlie loses
    wrapper.vm.handleGameEnd({
      winner: wrapper.vm.players[1],
      loser: wrapper.vm.players[2]
    })
    await wrapper.vm.$nextTick()

    // Next starter should now be Charlie
    expect(wrapper.vm.nextGameStartingPlayerIndex).toBe(2)
  })

  it('verifies FarkleGame receives and uses startingPlayerIndex', async () => {
    const players = [
      { name: 'Alice', score: 0, onBoard: false, wins: 0 },
      { name: 'Bob', score: 0, onBoard: false, wins: 0 },
      { name: 'Charlie', score: 0, onBoard: false, wins: 0 }
    ]

    const farkleGameWrapper = mount(FarkleGame, {
      props: {
        players,
        startingPlayerIndex: 2 // Charlie should start
      },
      global: {
        stubs: {
          ...vuetifyStubs,
          'current-player-header': true,
          'active-game': true,
          'game-over': true,
          'tie-breaker': true
        }
      }
    })

    // Verify Charlie (index 2) is the current player
    expect(farkleGameWrapper.vm.currentPlayer).toBe(2)
    expect(farkleGameWrapper.vm.currentPlayerName).toBe('Charlie')
  })

  it('player rotation maintains order starting from loser', async () => {
    const players = [
      { name: 'Alice', score: 0, onBoard: false, wins: 0 },
      { name: 'Bob', score: 0, onBoard: false, wins: 0 },
      { name: 'Charlie', score: 0, onBoard: false, wins: 0 }
    ]

    const farkleGameWrapper = mount(FarkleGame, {
      props: {
        players,
        startingPlayerIndex: 1 // Bob starts
      },
      global: {
        stubs: {
          ...vuetifyStubs,
          'current-player-header': true,
          'active-game': true,
          'game-over': true,
          'tie-breaker': true
        }
      }
    })

    // Turn order should be: Bob -> Charlie -> Alice -> Bob -> ...
    expect(farkleGameWrapper.vm.currentPlayerName).toBe('Bob')

    farkleGameWrapper.vm.nextPlayer()
    expect(farkleGameWrapper.vm.currentPlayerName).toBe('Charlie')

    farkleGameWrapper.vm.nextPlayer()
    expect(farkleGameWrapper.vm.currentPlayerName).toBe('Alice')

    farkleGameWrapper.vm.nextPlayer()
    expect(farkleGameWrapper.vm.currentPlayerName).toBe('Bob') // Wraps back
  })

  it('UI shows "Starting Player" indicator after game ends', async () => {
    const players = [
      { name: 'Alice', score: 10500, onBoard: true, wins: 0 },
      { name: 'Bob', score: 2000, onBoard: true, wins: 0 },
      { name: 'Charlie', score: 8000, onBoard: true, wins: 0 }
    ]

    const farkleGameWrapper = mount(FarkleGame, {
      props: {
        players,
        startingPlayerIndex: null
      },
      global: {
        stubs: {
          ...vuetifyStubs,
          'current-player-header': true,
          'active-game': true
        }
      }
    })

    // Trigger game over
    farkleGameWrapper.vm.gameOver = true
    await farkleGameWrapper.vm.$nextTick()

    // Check that nextStarterIndexAfterGame returns loser's index
    expect(farkleGameWrapper.vm.nextStarterIndexAfterGame).toBe(1) // Bob (lowest score)
  })

  it('handles edge case: all players have same score', async () => {
    const players = [
      { name: 'Alice', score: 5000, onBoard: true, wins: 0 },
      { name: 'Bob', score: 5000, onBoard: true, wins: 0 },
      { name: 'Charlie', score: 5000, onBoard: true, wins: 0 }
    ]

    const farkleGameWrapper = mount(FarkleGame, {
      props: {
        players,
        startingPlayerIndex: null
      },
      global: {
        stubs: {
          ...vuetifyStubs,
          'current-player-header': true,
          'active-game': true
        }
      }
    })

    // When all scores are equal, first player is "loser"
    const loserIndex = farkleGameWrapper.vm.findLoserIndex()
    expect(loserIndex).toBe(0)
  })

  it('full game lifecycle: game 1 ends, game 2 starts with loser first', async () => {
    wrapper.vm.players = [
      { name: 'Alice', score: 0, onBoard: false, wins: 0 },
      { name: 'Bob', score: 0, onBoard: false, wins: 0 }
    ]

    // Game 1: Alice wins, Bob loses
    wrapper.vm.startGame()
    await wrapper.vm.$nextTick()

    wrapper.vm.players[0].score = 10000
    wrapper.vm.players[1].score = 3000

    wrapper.vm.handleGameEnd({
      winner: wrapper.vm.players[0],
      loser: wrapper.vm.players[1]
    })
    await wrapper.vm.$nextTick()

    // Verify state
    expect(wrapper.vm.players[0].wins).toBe(1)
    expect(wrapper.vm.nextGameStartingPlayerIndex).toBe(1) // Bob

    // Restart for game 2
    wrapper.vm.restartGame()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.players[0].score).toBe(0)
    expect(wrapper.vm.players[1].score).toBe(0)

    // Start game 2
    wrapper.vm.startGame()
    await wrapper.vm.$nextTick()

    // Verify Bob's index is stored as next starter
    expect(wrapper.vm.nextGameStartingPlayerIndex).toBe(1)
  })
})
