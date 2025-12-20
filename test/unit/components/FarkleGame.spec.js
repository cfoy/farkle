import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import FarkleGame from '@/components/FarkleGame.vue'

describe('FarkleGame.vue', () => {
  let wrapper
  let players

  beforeEach(() => {
    players = [
      { name: 'Alice', score: 0 },
      { name: 'Bob', score: 0 },
      { name: 'Charlie', score: 0 }
    ]

    wrapper = mount(FarkleGame, {
      propsData: { players },
      stubs: {
        'farkle-turn': true,
        'score': true
      }
    })
  })

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('initializes with first player (index 0)', () => {
    expect(wrapper.vm.currentPlayer).toBe(0)
  })

  it('displays current player name', () => {
    expect(wrapper.vm.currentPlayerName).toBe('Alice')
  })

  describe('Player rotation', () => {
    it('advances to next player', async () => {
      wrapper.vm.nextPlayer()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.currentPlayer).toBe(1)
      expect(wrapper.vm.currentPlayerName).toBe('Bob')
    })

    it('rotates back to first player after last player', async () => {
      wrapper.vm.currentPlayer = 2
      wrapper.vm.nextPlayer()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.currentPlayer).toBe(0)
      expect(wrapper.vm.currentPlayerName).toBe('Alice')
    })

    it('handles rotation with 2 players', async () => {
      const twoPlayerWrapper = mount(FarkleGame, {
        propsData: {
          players: [
            { name: 'Player 1', score: 0 },
            { name: 'Player 2', score: 0 }
          ]
        },
        stubs: {
          'farkle-turn': true,
          'score': true
        }
      })

      twoPlayerWrapper.vm.nextPlayer()
      await twoPlayerWrapper.vm.$nextTick()
      expect(twoPlayerWrapper.vm.currentPlayer).toBe(1)

      twoPlayerWrapper.vm.nextPlayer()
      await twoPlayerWrapper.vm.$nextTick()
      expect(twoPlayerWrapper.vm.currentPlayer).toBe(0)
    })

    it('cycles through all players multiple times', async () => {
      for (let i = 0; i < 10; i++) {
        wrapper.vm.nextPlayer()
      }
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.currentPlayer).toBe(1)
    })
  })

  describe('Scoring', () => {
    it('adds points to current player score', async () => {
      wrapper.vm.score(500)
      await wrapper.vm.$nextTick()

      expect(players[0].score).toBe(500)
    })

    it('advances to next player after scoring', async () => {
      wrapper.vm.score(500)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.currentPlayer).toBe(1)
    })

    it('accumulates score across multiple turns for same player', async () => {
      wrapper.vm.score(300)
      await wrapper.vm.$nextTick()

      wrapper.vm.nextPlayer()
      wrapper.vm.nextPlayer()
      await wrapper.vm.$nextTick()

      wrapper.vm.score(200)
      await wrapper.vm.$nextTick()

      expect(players[0].score).toBe(500)
    })

    it('maintains separate scores for different players', async () => {
      wrapper.vm.score(100)
      await wrapper.vm.$nextTick()

      wrapper.vm.score(200)
      await wrapper.vm.$nextTick()

      wrapper.vm.score(300)
      await wrapper.vm.$nextTick()

      expect(players[0].score).toBe(100)
      expect(players[1].score).toBe(200)
      expect(players[2].score).toBe(300)
    })

    it('handles farkle (0 points)', async () => {
      wrapper.vm.score(0)
      await wrapper.vm.$nextTick()

      expect(players[0].score).toBe(0)
      expect(wrapper.vm.currentPlayer).toBe(1)
    })
  })

  describe('Component integration', () => {
    it('renders farkle-turn component', () => {
      expect(wrapper.findComponent({ name: 'farkle-turn' }).exists()).toBe(true)
    })

    it('renders score component with players prop', () => {
      const scoreComponent = wrapper.findComponent({ name: 'score' })
      expect(scoreComponent.exists()).toBe(true)
    })

    it('displays current player name in header', () => {
      const header = wrapper.find('h5')
      expect(header.text()).toContain('Alice')
    })
  })
})
