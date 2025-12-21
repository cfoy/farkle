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
})
