import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FarkleGame from '../../../src/components/FarkleGame.vue'
import { vuetifyStubs } from '../../setup'

describe('FarkleGame.vue - Player Rotation with Starting Player', () => {
  const createWrapper = (players, startingPlayerIndex = null) => {
    return mount(FarkleGame, {
      props: {
        players,
        startingPlayerIndex
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
  }

  it('starts with player 0 when startingPlayerIndex is null', () => {
    const players = [
      { name: 'Alice', score: 0, onBoard: false, wins: 0 },
      { name: 'Bob', score: 0, onBoard: false, wins: 0 },
      { name: 'Charlie', score: 0, onBoard: false, wins: 0 }
    ]

    const wrapper = createWrapper(players, null)
    expect(wrapper.vm.currentPlayer).toBe(0)
  })

  it('starts with designated player when startingPlayerIndex is provided', () => {
    const players = [
      { name: 'Alice', score: 0, onBoard: false, wins: 0 },
      { name: 'Bob', score: 0, onBoard: false, wins: 0 },
      { name: 'Charlie', score: 0, onBoard: false, wins: 0 }
    ]

    const wrapper = createWrapper(players, 1)
    expect(wrapper.vm.currentPlayer).toBe(1)
    expect(wrapper.vm.currentPlayerName).toBe('Bob')
  })

  it('rotates players in order starting from designated player', async () => {
    const players = [
      { name: 'Alice', score: 0, onBoard: false, wins: 0 },
      { name: 'Bob', score: 0, onBoard: false, wins: 0 },
      { name: 'Charlie', score: 0, onBoard: false, wins: 0 }
    ]

    const wrapper = createWrapper(players, 1) // Start with Bob
    expect(wrapper.vm.currentPlayerName).toBe('Bob') // 1st turn: Bob

    wrapper.vm.nextPlayer()
    expect(wrapper.vm.currentPlayerName).toBe('Charlie') // 2nd turn: Charlie

    wrapper.vm.nextPlayer()
    expect(wrapper.vm.currentPlayerName).toBe('Alice') // 3rd turn: Alice (wrapped)

    wrapper.vm.nextPlayer()
    expect(wrapper.vm.currentPlayerName).toBe('Bob') // 4th turn: Bob again
  })

  it('wraps correctly when starting player is last in list', async () => {
    const players = [
      { name: 'Alice', score: 0, onBoard: false, wins: 0 },
      { name: 'Bob', score: 0, onBoard: false, wins: 0 },
      { name: 'Charlie', score: 0, onBoard: false, wins: 0 }
    ]

    const wrapper = createWrapper(players, 2) // Start with Charlie (index 2)
    expect(wrapper.vm.currentPlayerName).toBe('Charlie')

    wrapper.vm.nextPlayer()
    expect(wrapper.vm.currentPlayerName).toBe('Alice') // Wraps to beginning

    wrapper.vm.nextPlayer()
    expect(wrapper.vm.currentPlayerName).toBe('Bob')
  })

  it('handles invalid startingPlayerIndex (negative)', () => {
    const players = [
      { name: 'Alice', score: 0, onBoard: false, wins: 0 },
      { name: 'Bob', score: 0, onBoard: false, wins: 0 }
    ]

    const wrapper = createWrapper(players, -1)
    expect(wrapper.vm.currentPlayer).toBe(0) // Falls back to 0
  })

  it('handles invalid startingPlayerIndex (out of bounds)', () => {
    const players = [
      { name: 'Alice', score: 0, onBoard: false, wins: 0 },
      { name: 'Bob', score: 0, onBoard: false, wins: 0 }
    ]

    const wrapper = createWrapper(players, 5)
    expect(wrapper.vm.currentPlayer).toBe(0) // Falls back to 0
  })

  it('maintains player order across multiple rounds', async () => {
    const players = [
      { name: 'Alice', score: 0, onBoard: false, wins: 0 },
      { name: 'Bob', score: 0, onBoard: false, wins: 0 },
      { name: 'Charlie', score: 0, onBoard: false, wins: 0 }
    ]

    const wrapper = createWrapper(players, 2) // Start with Charlie

    const turnOrder = []

    // Play 9 turns (3 complete rounds)
    for (let i = 0; i < 9; i++) {
      turnOrder.push(wrapper.vm.currentPlayerName)
      wrapper.vm.nextPlayer()
    }

    // Verify the order is: Charlie, Alice, Bob, Charlie, Alice, Bob, Charlie, Alice, Bob
    expect(turnOrder).toEqual([
      'Charlie', 'Alice', 'Bob',
      'Charlie', 'Alice', 'Bob',
      'Charlie', 'Alice', 'Bob'
    ])
  })

  it('works correctly with 2 players starting from second player', async () => {
    const players = [
      { name: 'Alice', score: 0, onBoard: false, wins: 0 },
      { name: 'Bob', score: 0, onBoard: false, wins: 0 }
    ]

    const wrapper = createWrapper(players, 1) // Start with Bob
    expect(wrapper.vm.currentPlayerName).toBe('Bob')

    wrapper.vm.nextPlayer()
    expect(wrapper.vm.currentPlayerName).toBe('Alice')

    wrapper.vm.nextPlayer()
    expect(wrapper.vm.currentPlayerName).toBe('Bob')
  })
})
