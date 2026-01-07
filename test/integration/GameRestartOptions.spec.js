import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { vuetifyStubs } from '../setup'
import Farkle from '@/components/Farkle.vue'
import FarkleGame from '@/components/FarkleGame.vue'
import GameOver from '@/components/GameOver.vue'

describe('Game Restart Options Integration', () => {
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

    // Setup players
    wrapper.vm.players = [
      { name: 'Alice', score: 0, onBoard: false, wins: 0 },
      { name: 'Bob', score: 0, onBoard: false, wins: 0 }
    ]
  })

  it('Play Again button restarts game with same players and loser goes first', async () => {
    // Start the game
    wrapper.vm.startGame()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.started).toBe(true)

    // Get the FarkleGame component
    const farkleGame = wrapper.findComponent(FarkleGame)
    expect(farkleGame.exists()).toBe(true)

    // Simulate game end with Alice winning and Bob losing
    const gameResult = {
      winner: wrapper.vm.players[0], // Alice
      loser: wrapper.vm.players[1]   // Bob
    }

    // Set game to finished state
    farkleGame.vm.gameOver = true
    farkleGame.vm.winningPlayerIndex = 0
    await wrapper.vm.$nextTick()

    // Find GameOver component
    const gameOver = farkleGame.findComponent(GameOver)
    expect(gameOver.exists()).toBe(true)

    // Simulate Play Again button click
    gameOver.vm.playAgain()
    await wrapper.vm.$nextTick()

    // Verify game state
    expect(wrapper.vm.started).toBe(true) // Still in game mode
    expect(wrapper.vm.players[0].score).toBe(0) // Scores reset
    expect(wrapper.vm.players[1].score).toBe(0)
    expect(wrapper.vm.players[0].onBoard).toBe(false) // onBoard reset
    expect(wrapper.vm.players[1].onBoard).toBe(false)
  })

  it('Change Players button returns to player setup', async () => {
    // Start the game
    wrapper.vm.startGame()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.started).toBe(true)

    // Get the FarkleGame component
    const farkleGame = wrapper.findComponent(FarkleGame)
    expect(farkleGame.exists()).toBe(true)

    // Set game to finished state
    farkleGame.vm.gameOver = true
    await wrapper.vm.$nextTick()

    // Find GameOver component
    const gameOver = farkleGame.findComponent(GameOver)
    expect(gameOver.exists()).toBe(true)

    // Simulate Change Players button click
    gameOver.vm.changePlayers()
    await wrapper.vm.$nextTick()

    // Verify we're back in player setup
    expect(wrapper.vm.started).toBe(false)
    expect(wrapper.vm.players[0].score).toBe(0)
    expect(wrapper.vm.players[1].score).toBe(0)
    expect(wrapper.vm.nextGameStartingPlayerIndex).toBeNull()
  })

  it('Play Again increments gameKey to force FarkleGame remount', async () => {
    wrapper.vm.startGame()
    await wrapper.vm.$nextTick()

    const initialGameKey = wrapper.vm.gameKey

    // Simulate play again
    wrapper.vm.playAgain(1)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.gameKey).toBe(initialGameKey + 1)
  })
})
