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

  it('initializes totalTurns to 0', () => {
    expect(wrapper.vm.totalTurns).toBe(0)
  })

  it('initializes winningPlayerIndex to null', () => {
    expect(wrapper.vm.winningPlayerIndex).toBe(null)
  })

  it('initializes inLastRound to false', () => {
    expect(wrapper.vm.inLastRound).toBe(false)
  })

  it('initializes gameOver to false', () => {
    expect(wrapper.vm.gameOver).toBe(false)
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

  describe('Turn counting', () => {
    it('increments totalTurns when nextPlayer is called', async () => {
      wrapper.vm.nextPlayer()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.totalTurns).toBe(1)
    })

    it('tracks totalTurns across multiple player rotations', async () => {
      wrapper.vm.nextPlayer()
      wrapper.vm.nextPlayer()
      wrapper.vm.nextPlayer()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.totalTurns).toBe(3)
      expect(wrapper.vm.currentPlayer).toBe(0)
    })

    it('increments totalTurns when scoring', async () => {
      wrapper.vm.score(500)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.totalTurns).toBe(1)
    })

    it('tracks totalTurns correctly over multiple rounds', async () => {
      for (let i = 0; i < 10; i++) {
        wrapper.vm.score(100)
      }
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.totalTurns).toBe(10)
    })

    it('allows calculating round number from totalTurns', async () => {
      for (let i = 0; i < 7; i++) {
        wrapper.vm.nextPlayer()
      }
      await wrapper.vm.$nextTick()

      const roundNumber = Math.floor(wrapper.vm.totalTurns / players.length)
      expect(roundNumber).toBe(2)
      expect(wrapper.vm.currentPlayer).toBe(1)
    })

    it('determines if all players have had equal turns', async () => {
      wrapper.vm.nextPlayer()
      wrapper.vm.nextPlayer()
      await wrapper.vm.$nextTick()

      let equalTurns = wrapper.vm.totalTurns % players.length === 0
      expect(equalTurns).toBe(false)

      wrapper.vm.nextPlayer()
      await wrapper.vm.$nextTick()

      equalTurns = wrapper.vm.totalTurns % players.length === 0
      expect(equalTurns).toBe(true)
    })
  })

  describe('Last round logic', () => {
    it('enters last round when player reaches 10,000', async () => {
      players[0].score = 9500
      wrapper.vm.score(500)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.inLastRound).toBe(true)
    })

    it('does not end game immediately when first player reaches 10k', async () => {
      players[0].score = 9500
      wrapper.vm.score(500)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.gameOver).toBe(false)
    })

    it('allows remaining players to take their turns in last round', async () => {
      players[0].score = 9500
      wrapper.vm.score(500)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.inLastRound).toBe(true)
      expect(wrapper.vm.currentPlayer).toBe(1)

      wrapper.vm.score(200)
      await wrapper.vm.$nextTick()

      expect(players[1].score).toBe(200)
      expect(wrapper.vm.gameOver).toBe(false)
    })

    it('ends game after all players have equal turns', async () => {
      players[0].score = 9500
      wrapper.vm.score(500)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.gameOver).toBe(false)

      wrapper.vm.score(200)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.gameOver).toBe(false)

      wrapper.vm.score(300)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.gameOver).toBe(true)
      expect(wrapper.vm.totalTurns).toBe(3)
    })

    it('ends game immediately when last player reaches 10k', async () => {
      wrapper.vm.score(100)
      wrapper.vm.score(200)
      await wrapper.vm.$nextTick()

      players[2].score = 9500
      wrapper.vm.score(1000)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.inLastRound).toBe(true)
      expect(wrapper.vm.gameOver).toBe(true)
      expect(wrapper.vm.totalTurns).toBe(3)
    })

    it('handles second player reaching 10k with proper last round', async () => {
      wrapper.vm.score(500)
      await wrapper.vm.$nextTick()

      players[1].score = 9000
      wrapper.vm.score(1500)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.inLastRound).toBe(true)
      expect(wrapper.vm.gameOver).toBe(false)

      wrapper.vm.score(400)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.gameOver).toBe(true)
      expect(players[2].score).toBe(400)
    })

    it('prevents scoring after game is over', async () => {
      players[0].score = 9500
      wrapper.vm.score(500)
      wrapper.vm.score(200)
      wrapper.vm.score(300)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.gameOver).toBe(true)
      const player0Score = players[0].score

      wrapper.vm.score(1000)
      await wrapper.vm.$nextTick()

      expect(players[0].score).toBe(player0Score)
    })

    it('tracks correct state through multiple rounds before winning', async () => {
      for (let i = 0; i < 6; i++) {
        wrapper.vm.score(1500)
      }
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.inLastRound).toBe(false)
      expect(wrapper.vm.gameOver).toBe(false)
      expect(wrapper.vm.totalTurns).toBe(6)

      players[0].score = 9000
      wrapper.vm.score(1500)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.inLastRound).toBe(true)
      expect(wrapper.vm.gameOver).toBe(false)

      wrapper.vm.score(1500)
      wrapper.vm.score(1500)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.gameOver).toBe(true)
    })
  })

  describe('Winning condition detection', () => {
    it('sets winningPlayerIndex when player reaches exactly 10,000', async () => {
      players[0].score = 9500
      wrapper.vm.score(500)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.winningPlayerIndex).toBe(0)
      expect(players[0].score).toBe(10000)
    })

    it('sets winningPlayerIndex when player exceeds 10,000', async () => {
      players[0].score = 9500
      wrapper.vm.score(1000)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.winningPlayerIndex).toBe(0)
      expect(players[0].score).toBe(10500)
    })

    it('does not set winningPlayerIndex for scores below 10,000', async () => {
      wrapper.vm.score(9999)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.winningPlayerIndex).toBe(null)
    })

    it('only records first player to reach 10,000', async () => {
      players[0].score = 9500
      wrapper.vm.score(500)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.winningPlayerIndex).toBe(0)

      players[1].score = 9800
      wrapper.vm.score(300)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.winningPlayerIndex).toBe(0)
      expect(players[1].score).toBe(10100)
    })

    it('tracks correct player index when second player reaches 10k first', async () => {
      wrapper.vm.score(5000)
      await wrapper.vm.$nextTick()

      players[1].score = 9000
      wrapper.vm.score(1500)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.winningPlayerIndex).toBe(1)
      expect(players[1].score).toBe(10500)
    })

    it('tracks correct player index when third player reaches 10k first', async () => {
      wrapper.vm.score(3000)
      wrapper.vm.score(4000)
      await wrapper.vm.$nextTick()

      players[2].score = 8000
      wrapper.vm.score(2500)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.winningPlayerIndex).toBe(2)
      expect(players[2].score).toBe(10500)
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

  describe('findWinnerIndex', () => {
    it('returns index of player with highest score', () => {
      players[0].score = 5000
      players[1].score = 8000
      players[2].score = 3000

      expect(wrapper.vm.findWinnerIndex()).toBe(1)
    })

    it('returns first player index when all scores are zero', () => {
      expect(wrapper.vm.findWinnerIndex()).toBe(0)
    })

    it('returns first player index when tied for highest score', () => {
      players[0].score = 10000
      players[1].score = 10000
      players[2].score = 5000

      expect(wrapper.vm.findWinnerIndex()).toBe(0)
    })

    it('returns last player index when they have highest score', () => {
      players[0].score = 5000
      players[1].score = 6000
      players[2].score = 12000

      expect(wrapper.vm.findWinnerIndex()).toBe(2)
    })

    it('handles negative scores correctly', () => {
      players[0].score = -100
      players[1].score = 0
      players[2].score = -50

      expect(wrapper.vm.findWinnerIndex()).toBe(1)
    })
  })

  describe('Winner determination', () => {
    it('returns null when game is not over', () => {
      expect(wrapper.vm.winner).toBe(null)
    })

    it('returns null during last round before game ends', async () => {
      players[0].score = 9500
      wrapper.vm.score(500)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.inLastRound).toBe(true)
      expect(wrapper.vm.gameOver).toBe(false)
      expect(wrapper.vm.winner).toBe(null)
    })

    it('identifies winner after game ends', async () => {
      players[0].score = 9500
      wrapper.vm.score(500)
      wrapper.vm.score(200)
      wrapper.vm.score(300)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.gameOver).toBe(true)
      expect(wrapper.vm.winner).toBe(players[0])
      expect(wrapper.vm.winner.name).toBe('Alice')
      expect(wrapper.vm.winner.score).toBe(10000)
    })

    it('identifies correct winner when second player has highest score', async () => {
      players[0].score = 9500
      wrapper.vm.score(500)
      await wrapper.vm.$nextTick()

      players[1].score = 8000
      wrapper.vm.score(3000)
      await wrapper.vm.$nextTick()

      wrapper.vm.score(200)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.gameOver).toBe(true)
      expect(wrapper.vm.winner).toBe(players[1])
      expect(wrapper.vm.winner.name).toBe('Bob')
      expect(wrapper.vm.winner.score).toBe(11000)
    })

    it('identifies correct winner when third player has highest score', async () => {
      players[0].score = 9000
      wrapper.vm.score(1000)
      await wrapper.vm.$nextTick()

      wrapper.vm.score(500)
      await wrapper.vm.$nextTick()

      players[2].score = 9000
      wrapper.vm.score(2500)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.gameOver).toBe(true)
      expect(wrapper.vm.winner).toBe(players[2])
      expect(wrapper.vm.winner.name).toBe('Charlie')
      expect(wrapper.vm.winner.score).toBe(11500)
    })

    it('returns first player in case of tie', async () => {
      players[0].score = 9500
      wrapper.vm.score(500)
      await wrapper.vm.$nextTick()

      players[1].score = 9500
      wrapper.vm.score(500)
      await wrapper.vm.$nextTick()

      wrapper.vm.score(100)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.gameOver).toBe(true)
      expect(wrapper.vm.winner).toBe(players[0])
      expect(wrapper.vm.winner.score).toBe(10000)
      expect(players[1].score).toBe(10000)
    })

    it('identifies winner when player who triggered winning didnt win', async () => {
      players[0].score = 9500
      wrapper.vm.score(500)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.winningPlayerIndex).toBe(0)

      players[1].score = 9000
      wrapper.vm.score(2000)
      await wrapper.vm.$nextTick()

      players[2].score = 8000
      wrapper.vm.score(3500)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.gameOver).toBe(true)
      expect(wrapper.vm.winner).toBe(players[2])
      expect(wrapper.vm.winner.score).toBe(11500)
    })

    it('handles scenario where all players have low scores', async () => {
      players[0].score = 9500
      wrapper.vm.score(500)
      wrapper.vm.score(0)
      wrapper.vm.score(0)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.gameOver).toBe(true)
      expect(wrapper.vm.winner).toBe(players[0])
      expect(wrapper.vm.winner.score).toBe(10000)
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
