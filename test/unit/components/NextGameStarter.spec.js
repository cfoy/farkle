import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Farkle from '../../../src/components/Farkle.vue'
import { vuetifyStubs } from '../../setup'

describe('Farkle.vue - Next Game Starting Player State', () => {
  let wrapper

  const createWrapper = () => {
    return mount(Farkle, {
      global: {
        stubs: {
          ...vuetifyStubs,
          'player-list': true,
          'create-player': true,
          'farkle-game': true
        }
      }
    })
  }

  it('initializes nextGameStartingPlayerIndex as null', () => {
    wrapper = createWrapper()
    expect(wrapper.vm.nextGameStartingPlayerIndex).toBeNull()
  })

  it('stores loser index when game ends', async () => {
    wrapper = createWrapper()

    // Add players
    wrapper.vm.players = [
      { name: 'Alice', score: 10500, onBoard: true, wins: 0 },
      { name: 'Bob', score: 2000, onBoard: true, wins: 0 },
      { name: 'Charlie', score: 8000, onBoard: true, wins: 0 }
    ]

    // Simulate game end with winner and loser
    const gameResult = {
      winner: wrapper.vm.players[0], // Alice wins
      loser: wrapper.vm.players[1]   // Bob loses
    }

    wrapper.vm.handleGameEnd(gameResult)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.nextGameStartingPlayerIndex).toBe(1) // Bob's index
  })

  it('updates loser index when subsequent game ends', async () => {
    wrapper = createWrapper()

    // Add players
    wrapper.vm.players = [
      { name: 'Alice', score: 0, onBoard: false, wins: 0 },
      { name: 'Bob', score: 0, onBoard: false, wins: 0 },
      { name: 'Charlie', score: 0, onBoard: false, wins: 0 }
    ]

    // First game: Bob loses
    let gameResult = {
      winner: wrapper.vm.players[0],
      loser: wrapper.vm.players[1]
    }
    wrapper.vm.handleGameEnd(gameResult)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.nextGameStartingPlayerIndex).toBe(1)

    // Second game: Charlie loses
    gameResult = {
      winner: wrapper.vm.players[1],
      loser: wrapper.vm.players[2]
    }
    wrapper.vm.handleGameEnd(gameResult)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.nextGameStartingPlayerIndex).toBe(2) // Updated to Charlie's index
  })

  it('renders farkle-game component when game is started', async () => {
    wrapper = createWrapper()

    wrapper.vm.players = [
      { name: 'Alice', score: 0, onBoard: false, wins: 0 },
      { name: 'Bob', score: 0, onBoard: false, wins: 0 }
    ]
    wrapper.vm.nextGameStartingPlayerIndex = 1
    wrapper.vm.started = true
    await wrapper.vm.$nextTick()

    const farkleGame = wrapper.findComponent({ name: 'farkle-game' })
    expect(farkleGame.exists()).toBe(true)
    // The prop will be used in task farkle-3pt to set initial currentPlayer
  })

  it('handles game end with old format (direct winner object)', async () => {
    wrapper = createWrapper()

    wrapper.vm.players = [
      { name: 'Alice', score: 10500, onBoard: true, wins: 0 },
      { name: 'Bob', score: 2000, onBoard: true, wins: 0 }
    ]

    // Old format: just winner object (no loser)
    wrapper.vm.handleGameEnd(wrapper.vm.players[0])
    await wrapper.vm.$nextTick()

    // Should not crash, nextGameStartingPlayerIndex remains null
    expect(wrapper.vm.nextGameStartingPlayerIndex).toBeNull()
    expect(wrapper.vm.players[0].wins).toBe(1) // Winner still incremented
  })

  it('resets nextGameStartingPlayerIndex when changing players', async () => {
    wrapper = createWrapper()

    wrapper.vm.players = [
      { name: 'Alice', score: 10500, onBoard: true, wins: 1 },
      { name: 'Bob', score: 2000, onBoard: true, wins: 0 }
    ]
    wrapper.vm.nextGameStartingPlayerIndex = 1
    wrapper.vm.started = true

    // Restart game (Change Players button)
    wrapper.vm.restartGame()
    await wrapper.vm.$nextTick()

    // nextGameStartingPlayerIndex should be reset when changing players
    expect(wrapper.vm.nextGameStartingPlayerIndex).toBeNull()
    // Scores should be reset
    expect(wrapper.vm.players[0].score).toBe(0)
    expect(wrapper.vm.players[1].score).toBe(0)
    // Should return to player setup
    expect(wrapper.vm.started).toBe(false)
  })

  it('playAgain resets scores and sets loser as starting player', async () => {
    wrapper = createWrapper()

    wrapper.vm.players = [
      { name: 'Alice', score: 10500, onBoard: true, wins: 1 },
      { name: 'Bob', score: 2000, onBoard: true, wins: 0 }
    ]
    wrapper.vm.started = true
    const initialGameKey = wrapper.vm.gameKey

    // Play again with Bob (index 1) as loser
    wrapper.vm.playAgain(1)
    await wrapper.vm.$nextTick()

    // Scores should be reset
    expect(wrapper.vm.players[0].score).toBe(0)
    expect(wrapper.vm.players[1].score).toBe(0)
    // onBoard should be reset
    expect(wrapper.vm.players[0].onBoard).toBe(false)
    expect(wrapper.vm.players[1].onBoard).toBe(false)
    // Loser should be set as next starter
    expect(wrapper.vm.nextGameStartingPlayerIndex).toBe(1)
    // Game should stay started
    expect(wrapper.vm.started).toBe(true)
    // gameKey should increment to force remount
    expect(wrapper.vm.gameKey).toBe(initialGameKey + 1)
  })

  it('playAgain preserves player wins', async () => {
    wrapper = createWrapper()

    wrapper.vm.players = [
      { name: 'Alice', score: 10500, onBoard: true, wins: 3 },
      { name: 'Bob', score: 2000, onBoard: true, wins: 1 }
    ]

    wrapper.vm.playAgain(1)
    await wrapper.vm.$nextTick()

    // Wins should be preserved
    expect(wrapper.vm.players[0].wins).toBe(3)
    expect(wrapper.vm.players[1].wins).toBe(1)
  })
})
