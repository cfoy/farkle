import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Farkle from '@/components/Farkle.vue'

describe('Farkle.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Farkle, {
      stubs: {
        'create-player': true,
        'player-list': true,
        'farkle-game': true
      }
    })
  })

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('initializes with empty players array', () => {
    expect(wrapper.vm.players).toEqual([])
  })

  it('initializes with started as false', () => {
    expect(wrapper.vm.started).toBe(false)
  })

  describe('Game setup phase', () => {
    it('displays setup components when game not started', () => {
      expect(wrapper.findComponent({ name: 'create-player' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'player-list' }).exists()).toBe(true)
    })

    it('does not display game component when game not started', () => {
      expect(wrapper.findComponent({ name: 'farkle-game' }).exists()).toBe(false)
    })

    it('displays start game button when game not started', () => {
      const buttons = wrapper.findAll('button')
      const startButton = buttons.filter(btn => btn.text() === 'Start Game').at(0)
      expect(startButton).toBeTruthy()
      expect(startButton.text()).toBe('Start Game')
    })
  })

  describe('Player creation', () => {
    it('adds player to players array', async () => {
      const player = { name: 'Alice', score: 0 }
      wrapper.vm.createPlayer(player)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.players.length).toBe(1)
      expect(wrapper.vm.players[0]).toEqual(player)
    })

    it('adds multiple players', async () => {
      wrapper.vm.createPlayer({ name: 'Alice', score: 0 })
      wrapper.vm.createPlayer({ name: 'Bob', score: 0 })
      wrapper.vm.createPlayer({ name: 'Charlie', score: 0 })
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.players.length).toBe(3)
      expect(wrapper.vm.players[0].name).toBe('Alice')
      expect(wrapper.vm.players[1].name).toBe('Bob')
      expect(wrapper.vm.players[2].name).toBe('Charlie')
    })
  })

  describe('Starting the game', () => {
    it('does not start game with 0 players', async () => {
      wrapper.vm.startGame()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.started).toBe(false)
    })

    it('does not start game with 1 player', async () => {
      wrapper.vm.players = [{ name: 'Alice', score: 0 }]
      wrapper.vm.startGame()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.started).toBe(false)
    })

    it('starts game with 2 players', async () => {
      wrapper.vm.players = [
        { name: 'Alice', score: 0 },
        { name: 'Bob', score: 0 }
      ]
      wrapper.vm.startGame()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.started).toBe(true)
    })

    it('starts game with 3+ players', async () => {
      wrapper.vm.players = [
        { name: 'Alice', score: 0 },
        { name: 'Bob', score: 0 },
        { name: 'Charlie', score: 0 }
      ]
      wrapper.vm.startGame()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.started).toBe(true)
    })
  })

  describe('Game phase', () => {
    beforeEach(async () => {
      wrapper.vm.players = [
        { name: 'Alice', score: 0 },
        { name: 'Bob', score: 0 }
      ]
      wrapper.vm.started = true
      await wrapper.vm.$nextTick()
    })

    it('displays game component when started', () => {
      expect(wrapper.findComponent({ name: 'farkle-game' }).exists()).toBe(true)
    })

    it('does not display setup components when started', () => {
      expect(wrapper.findComponent({ name: 'create-player' }).exists()).toBe(false)
      expect(wrapper.findComponent({ name: 'player-list' }).exists()).toBe(false)
    })

    it('passes players to game component', () => {
      const gameComponent = wrapper.findComponent({ name: 'farkle-game' })
      expect(gameComponent.exists()).toBe(true)
    })
  })

  describe('Complete game flow', () => {
    it('handles full game setup flow', async () => {
      expect(wrapper.vm.started).toBe(false)
      expect(wrapper.vm.players.length).toBe(0)

      wrapper.vm.createPlayer({ name: 'Player 1', score: 0 })
      wrapper.vm.createPlayer({ name: 'Player 2', score: 0 })
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.players.length).toBe(2)
      expect(wrapper.vm.started).toBe(false)

      wrapper.vm.startGame()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.started).toBe(true)
      expect(wrapper.findComponent({ name: 'farkle-game' }).exists()).toBe(true)
    })
  })

  describe('Restart game', () => {
    beforeEach(async () => {
      // Setup a game in progress with players who have scores
      wrapper.vm.players = [
        { name: 'Alice', score: 250 },
        { name: 'Bob', score: 150 }
      ]
      wrapper.vm.started = true
      await wrapper.vm.$nextTick()
    })

    it('displays restart button when game is started', () => {
      const buttons = wrapper.findAll('button')
      const restartButton = buttons.filter(btn => btn.text() === 'Restart Game').at(0)
      expect(restartButton).toBeTruthy()
      expect(restartButton.text()).toBe('Restart Game')
    })

    it('does not display restart button when game not started', async () => {
      wrapper.vm.started = false
      await wrapper.vm.$nextTick()

      const buttons = wrapper.findAll('button')
      const restartButton = buttons.filter(btn => btn.text() === 'Restart Game')
      expect(restartButton.length).toBe(0)
    })

    it('resets all player scores to 0 when restart clicked', async () => {
      expect(wrapper.vm.players[0].score).toBe(250)
      expect(wrapper.vm.players[1].score).toBe(150)

      wrapper.vm.restartGame()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.players[0].score).toBe(0)
      expect(wrapper.vm.players[1].score).toBe(0)
    })

    it('returns to player setup view when restart clicked', async () => {
      expect(wrapper.vm.started).toBe(true)

      wrapper.vm.restartGame()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.started).toBe(false)
      expect(wrapper.findComponent({ name: 'create-player' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'player-list' }).exists()).toBe(true)
    })

    it('preserves player list after restart', async () => {
      const originalPlayers = [...wrapper.vm.players]

      wrapper.vm.restartGame()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.players.length).toBe(2)
      expect(wrapper.vm.players[0].name).toBe('Alice')
      expect(wrapper.vm.players[1].name).toBe('Bob')
    })

    it('allows starting a new game after restart', async () => {
      wrapper.vm.restartGame()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.started).toBe(false)

      wrapper.vm.startGame()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.started).toBe(true)
      expect(wrapper.findComponent({ name: 'farkle-game' }).exists()).toBe(true)
    })
  })

  describe('Win tracking', () => {
    beforeEach(() => {
      localStorage.clear()
      wrapper.vm.players = [
        { name: 'Alice', score: 10500, wins: 2 },
        { name: 'Bob', score: 9500, wins: 3 }
      ]
    })

    it('increments winner wins count when handleGameEnd is called', async () => {
      const winner = wrapper.vm.players[0]
      expect(winner.wins).toBe(2)

      wrapper.vm.handleGameEnd(winner)
      await wrapper.vm.$nextTick()

      expect(winner.wins).toBe(3)
    })

    it('handles different winner correctly', async () => {
      const winner = wrapper.vm.players[1]
      expect(winner.wins).toBe(3)

      wrapper.vm.handleGameEnd(winner)
      await wrapper.vm.$nextTick()

      expect(winner.wins).toBe(4)
    })

    it('does not increment wins for null winner', async () => {
      const initialWins = [...wrapper.vm.players.map(p => p.wins)]

      wrapper.vm.handleGameEnd(null)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.players[0].wins).toBe(initialWins[0])
      expect(wrapper.vm.players[1].wins).toBe(initialWins[1])
    })

    it('does not increment wins for undefined winner', async () => {
      const initialWins = [...wrapper.vm.players.map(p => p.wins)]

      wrapper.vm.handleGameEnd(undefined)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.players[0].wins).toBe(initialWins[0])
      expect(wrapper.vm.players[1].wins).toBe(initialWins[1])
    })

    it('increments wins from 0 correctly', async () => {
      wrapper.vm.players[0].wins = 0
      const winner = wrapper.vm.players[0]

      wrapper.vm.handleGameEnd(winner)
      await wrapper.vm.$nextTick()

      expect(winner.wins).toBe(1)
    })
  })

  describe('localStorage persistence', () => {
    beforeEach(() => {
      localStorage.clear()
      wrapper.vm.players = [
        { name: 'Alice', score: 10500, wins: 5 },
        { name: 'Bob', score: 9500, wins: 3 },
        { name: 'Charlie', score: 8000, wins: 7 }
      ]
    })

    it('saves wins to localStorage when game ends', async () => {
      const winner = wrapper.vm.players[0]
      wrapper.vm.handleGameEnd(winner)
      await wrapper.vm.$nextTick()

      const stored = localStorage.getItem('farkle-wins')
      expect(stored).toBeTruthy()

      const winsData = JSON.parse(stored)
      expect(winsData.Alice).toBe(6)
      expect(winsData.Bob).toBe(3)
      expect(winsData.Charlie).toBe(7)
    })

    it('saves all players wins to localStorage', async () => {
      wrapper.vm.saveWinsToLocalStorage()
      await wrapper.vm.$nextTick()

      const stored = localStorage.getItem('farkle-wins')
      const winsData = JSON.parse(stored)

      expect(winsData.Alice).toBe(5)
      expect(winsData.Bob).toBe(3)
      expect(winsData.Charlie).toBe(7)
    })

    it('overwrites previous localStorage data', async () => {
      localStorage.setItem('farkle-wins', JSON.stringify({ 'OldPlayer': 10 }))

      wrapper.vm.saveWinsToLocalStorage()
      await wrapper.vm.$nextTick()

      const stored = localStorage.getItem('farkle-wins')
      const winsData = JSON.parse(stored)

      expect(winsData.OldPlayer).toBeUndefined()
      expect(winsData.Alice).toBe(5)
    })

    it('loads wins from localStorage correctly', () => {
      localStorage.setItem('farkle-wins', JSON.stringify({
        'Alice': 10,
        'Bob': 5
      }))

      const aliceWins = wrapper.vm.loadWinsFromLocalStorage('Alice')
      const bobWins = wrapper.vm.loadWinsFromLocalStorage('Bob')

      expect(aliceWins).toBe(10)
      expect(bobWins).toBe(5)
    })

    it('returns 0 for unknown player when loading from localStorage', () => {
      localStorage.setItem('farkle-wins', JSON.stringify({
        'Alice': 10
      }))

      const wins = wrapper.vm.loadWinsFromLocalStorage('Unknown')
      expect(wins).toBe(0)
    })

    it('returns 0 when localStorage is empty', () => {
      const wins = wrapper.vm.loadWinsFromLocalStorage('Alice')
      expect(wins).toBe(0)
    })

    it('handles corrupted localStorage gracefully', () => {
      localStorage.setItem('farkle-wins', 'invalid json')

      const wins = wrapper.vm.loadWinsFromLocalStorage('Alice')
      expect(wins).toBe(0)
    })
  })

  describe('Reset win statistics', () => {
    beforeEach(() => {
      localStorage.clear()
      wrapper.vm.players = [
        { name: 'Alice', score: 500, wins: 5 },
        { name: 'Bob', score: 300, wins: 3 }
      ]
    })

    it('clears localStorage when reset is called', async () => {
      localStorage.setItem('farkle-wins', JSON.stringify({ 'Alice': 5, 'Bob': 3 }))

      wrapper.vm.resetWinStatistics()
      await wrapper.vm.$nextTick()

      const stored = localStorage.getItem('farkle-wins')
      expect(stored).toBeNull()
    })

    it('resets all player wins to 0', async () => {
      wrapper.vm.resetWinStatistics()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.players[0].wins).toBe(0)
      expect(wrapper.vm.players[1].wins).toBe(0)
    })

    it('preserves player names and scores when resetting wins', async () => {
      wrapper.vm.resetWinStatistics()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.players[0].name).toBe('Alice')
      expect(wrapper.vm.players[0].score).toBe(500)
      expect(wrapper.vm.players[1].name).toBe('Bob')
      expect(wrapper.vm.players[1].score).toBe(300)
    })

    it('displays reset button in setup phase', async () => {
      wrapper.vm.started = false
      await wrapper.vm.$nextTick()

      const buttons = wrapper.findAll('button')
      const resetButton = buttons.filter(btn => btn.text().includes('Reset Win Statistics'))
      expect(resetButton.length).toBeGreaterThan(0)
    })
  })
})
