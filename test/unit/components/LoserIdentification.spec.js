import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FarkleGame from '../../../src/components/FarkleGame.vue'
import { vuetifyStubs } from '../../setup'

describe('FarkleGame.vue - Loser Identification', () => {
  let wrapper

  const createWrapper = (players) => {
    return mount(FarkleGame, {
      props: { players },
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
  }

  it('finds loser with lowest score', async () => {
    const players = [
      { name: 'Alice', score: 5000, onBoard: true, wins: 0 },
      { name: 'Bob', score: 2000, onBoard: true, wins: 0 },
      { name: 'Charlie', score: 8000, onBoard: true, wins: 0 }
    ]

    wrapper = createWrapper(players)

    const loserIndex = wrapper.vm.findLoserIndex()
    expect(loserIndex).toBe(1) // Bob has lowest score
  })

  it('finds loser when scores are equal to 0', async () => {
    const players = [
      { name: 'Alice', score: 5000, onBoard: true, wins: 0 },
      { name: 'Bob', score: 0, onBoard: false, wins: 0 },
      { name: 'Charlie', score: 3000, onBoard: true, wins: 0 }
    ]

    wrapper = createWrapper(players)

    const loserIndex = wrapper.vm.findLoserIndex()
    expect(loserIndex).toBe(1) // Bob has 0 score
  })

  it('returns first player as loser when all scores are equal', async () => {
    const players = [
      { name: 'Alice', score: 5000, onBoard: true, wins: 0 },
      { name: 'Bob', score: 5000, onBoard: true, wins: 0 },
      { name: 'Charlie', score: 5000, onBoard: true, wins: 0 }
    ]

    wrapper = createWrapper(players)

    const loserIndex = wrapper.vm.findLoserIndex()
    expect(loserIndex).toBe(0) // First player when all equal
  })

  it('loser computed property returns null when game not over', async () => {
    const players = [
      { name: 'Alice', score: 5000, onBoard: true, wins: 0 },
      { name: 'Bob', score: 2000, onBoard: true, wins: 0 }
    ]

    wrapper = createWrapper(players)

    expect(wrapper.vm.loser).toBeNull()
  })

  it('loser computed property returns loser player when game is over', async () => {
    const players = [
      { name: 'Alice', score: 10500, onBoard: true, wins: 0 },
      { name: 'Bob', score: 2000, onBoard: true, wins: 0 },
      { name: 'Charlie', score: 8000, onBoard: true, wins: 0 }
    ]

    wrapper = createWrapper(players)

    // Trigger game over by scoring to trigger last round
    wrapper.vm.gameOver = true
    await wrapper.vm.$nextTick()

    const loser = wrapper.vm.loser
    expect(loser).toBeTruthy()
    expect(loser.name).toBe('Bob')
    expect(loser.score).toBe(2000)
  })

  it('emits game-end event with both winner and loser', async () => {
    const players = [
      { name: 'Alice', score: 10500, onBoard: true, wins: 0 },
      { name: 'Bob', score: 2000, onBoard: true, wins: 0 },
      { name: 'Charlie', score: 8000, onBoard: true, wins: 0 }
    ]

    wrapper = createWrapper(players)

    // Set game over state
    wrapper.vm.gameOver = true
    await wrapper.vm.$nextTick()

    // Manually call emitWinner since we're testing in isolation
    wrapper.vm.emitWinner()
    await wrapper.vm.$nextTick()

    const emitted = wrapper.emitted('game-end')
    expect(emitted).toBeTruthy()
    expect(emitted.length).toBe(1)

    const gameResult = emitted[0][0]
    expect(gameResult).toHaveProperty('winner')
    expect(gameResult).toHaveProperty('loser')
    expect(gameResult.winner.name).toBe('Alice')
    expect(gameResult.loser.name).toBe('Bob')
  })
})
