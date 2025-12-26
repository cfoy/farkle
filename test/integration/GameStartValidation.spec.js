import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Farkle from '@/components/Farkle.vue'
import CreatePlayer from '@/components/CreatePlayer.vue'
import PlayerList from '@/components/PlayerList.vue'
import FarkleGame from '@/components/FarkleGame.vue'
import { vuetifyStubs } from '../setup.js'

describe('Game Start Validation Integration', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Farkle, {
      global: {
        stubs: vuetifyStubs
      }
    })
  })

  describe('Preventing game start with insufficient players', () => {
    it('does not start game with 0 players when Start Game clicked', async () => {
      // Verify initial state - setup view visible
      expect(wrapper.findComponent(CreatePlayer).exists()).toBe(true)
      expect(wrapper.findComponent(PlayerList).exists()).toBe(true)
      expect(wrapper.findComponent(FarkleGame).exists()).toBe(false)
      expect(wrapper.vm.started).toBe(false)

      // Try to start game with no players
      const buttons = wrapper.findAll('button')
      const startButton = buttons.wrappers.find(btn => btn.text().includes('Start Game'))
      await startButton.trigger('click')

      // Game should not start
      expect(wrapper.vm.started).toBe(false)
      expect(wrapper.findComponent(FarkleGame).exists()).toBe(false)
      expect(wrapper.findComponent(CreatePlayer).exists()).toBe(true)
    })

    it('does not start game with 1 player when Start Game clicked', async () => {
      // Add one player
      const createPlayer = wrapper.findComponent(CreatePlayer)
      createPlayer.vm.name = 'Alice'
      await wrapper.vm.$nextTick()
      createPlayer.vm.addPlayer()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.players.length).toBe(1)

      // Try to start game
      const buttons = wrapper.findAll('button')
      const startButton = buttons.wrappers.find(btn => btn.text().includes('Start Game'))
      await startButton.trigger('click')

      // Game should not start
      expect(wrapper.vm.started).toBe(false)
      expect(wrapper.findComponent(FarkleGame).exists()).toBe(false)
      expect(wrapper.findComponent(CreatePlayer).exists()).toBe(true)
      expect(wrapper.findComponent(PlayerList).exists()).toBe(true)
    })
  })

  describe('Allowing game start with sufficient players', () => {
    it('starts game with exactly 2 players when Start Game clicked', async () => {
      // Add two players
      const createPlayer = wrapper.findComponent(CreatePlayer)

      createPlayer.vm.name = 'Alice'
      await wrapper.vm.$nextTick()
      createPlayer.vm.addPlayer()
      await wrapper.vm.$nextTick()

      createPlayer.vm.name = 'Bob'
      await wrapper.vm.$nextTick()
      createPlayer.vm.addPlayer()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.players.length).toBe(2)

      // Start game
      const buttons = wrapper.findAll('button')
      const startButton = buttons.wrappers.find(btn => btn.text().includes('Start Game'))
      await startButton.trigger('click')

      // Game should start
      expect(wrapper.vm.started).toBe(true)
      expect(wrapper.findComponent(FarkleGame).exists()).toBe(true)
    })

    it('starts game with 3 players when Start Game clicked', async () => {
      // Add three players
      const createPlayer = wrapper.findComponent(CreatePlayer)

      createPlayer.vm.name = 'Alice'
      await wrapper.vm.$nextTick()
      createPlayer.vm.addPlayer()
      await wrapper.vm.$nextTick()

      createPlayer.vm.name = 'Bob'
      await wrapper.vm.$nextTick()
      createPlayer.vm.addPlayer()
      await wrapper.vm.$nextTick()

      createPlayer.vm.name = 'Charlie'
      await wrapper.vm.$nextTick()
      createPlayer.vm.addPlayer()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.players.length).toBe(3)

      // Start game
      const buttons = wrapper.findAll('button')
      const startButton = buttons.wrappers.find(btn => btn.text().includes('Start Game'))
      await startButton.trigger('click')

      // Game should start
      expect(wrapper.vm.started).toBe(true)
      expect(wrapper.findComponent(FarkleGame).exists()).toBe(true)
    })

    it('starts game with 4+ players when Start Game clicked', async () => {
      // Add four players
      const createPlayer = wrapper.findComponent(CreatePlayer)
      const playerNames = ['Alice', 'Bob', 'Charlie', 'Dave']

      for (const name of playerNames) {
        createPlayer.vm.name = name
        await wrapper.vm.$nextTick()
        createPlayer.vm.addPlayer()
        await wrapper.vm.$nextTick()
      }

      expect(wrapper.vm.players.length).toBe(4)

      // Start game
      const buttons = wrapper.findAll('button')
      const startButton = buttons.wrappers.find(btn => btn.text().includes('Start Game'))
      await startButton.trigger('click')

      // Game should start
      expect(wrapper.vm.started).toBe(true)
      expect(wrapper.findComponent(FarkleGame).exists()).toBe(true)
    })
  })

  describe('Component transition from setup to game view', () => {
    it('hides setup components when game starts', async () => {
      // Add two players
      const createPlayer = wrapper.findComponent(CreatePlayer)

      createPlayer.vm.name = 'Alice'
      await wrapper.vm.$nextTick()
      createPlayer.vm.addPlayer()
      await wrapper.vm.$nextTick()

      createPlayer.vm.name = 'Bob'
      await wrapper.vm.$nextTick()
      createPlayer.vm.addPlayer()
      await wrapper.vm.$nextTick()

      // Verify setup components are visible
      expect(wrapper.findComponent(CreatePlayer).exists()).toBe(true)
      expect(wrapper.findComponent(PlayerList).exists()).toBe(true)

      // Start game
      const buttons = wrapper.findAll('button')
      const startButton = buttons.wrappers.find(btn => btn.text().includes('Start Game'))
      await startButton.trigger('click')

      // Setup components should be hidden
      expect(wrapper.findComponent(CreatePlayer).exists()).toBe(false)
      expect(wrapper.findComponent(PlayerList).exists()).toBe(false)
    })

    it('displays game component with correct players data', async () => {
      // Add players
      const createPlayer = wrapper.findComponent(CreatePlayer)

      createPlayer.vm.name = 'Alice'
      await wrapper.vm.$nextTick()
      createPlayer.vm.addPlayer()
      await wrapper.vm.$nextTick()

      createPlayer.vm.name = 'Bob'
      await wrapper.vm.$nextTick()
      createPlayer.vm.addPlayer()
      await wrapper.vm.$nextTick()

      // Start game
      const buttons = wrapper.findAll('button')
      const startButton = buttons.wrappers.find(btn => btn.text().includes('Start Game'))
      await startButton.trigger('click')

      // FarkleGame component should exist and receive players
      const gameComponent = wrapper.findComponent(FarkleGame)
      expect(gameComponent.exists()).toBe(true)
      expect(gameComponent.props('players')).toEqual([
        { name: 'Alice', score: 0, onBoard: false, wins: 0 },
        { name: 'Bob', score: 0, onBoard: false, wins: 0 }
      ])
    })

    it('displays current player name in game view', async () => {
      // Add players
      const createPlayer = wrapper.findComponent(CreatePlayer)

      createPlayer.vm.name = 'Alice'
      await wrapper.vm.$nextTick()
      createPlayer.vm.addPlayer()
      await wrapper.vm.$nextTick()

      createPlayer.vm.name = 'Bob'
      await wrapper.vm.$nextTick()
      createPlayer.vm.addPlayer()
      await wrapper.vm.$nextTick()

      // Start game
      const buttons = wrapper.findAll('button')
      const startButton = buttons.wrappers.find(btn => btn.text().includes('Start Game'))
      await startButton.trigger('click')

      // Game should display first player's name
      const gameComponent = wrapper.findComponent(FarkleGame)
      expect(gameComponent.text()).toContain('Alice')
      expect(gameComponent.vm.currentPlayerName).toBe('Alice')
    })
  })

  describe('Complete game start flow', () => {
    it('handles full workflow from no players to started game', async () => {
      // Initial state: setup view, no players
      expect(wrapper.vm.started).toBe(false)
      expect(wrapper.vm.players).toEqual([])
      expect(wrapper.findComponent(CreatePlayer).exists()).toBe(true)
      expect(wrapper.findComponent(FarkleGame).exists()).toBe(false)

      // Try to start with 0 players - should fail
      let buttons = wrapper.findAll('button')
      let startButton = buttons.wrappers.find(btn => btn.text().includes('Start Game'))
      await startButton.trigger('click')
      expect(wrapper.vm.started).toBe(false)

      // Add 1 player
      const createPlayer = wrapper.findComponent(CreatePlayer)
      createPlayer.vm.name = 'Alice'
      await wrapper.vm.$nextTick()
      createPlayer.vm.addPlayer()
      await wrapper.vm.$nextTick()

      // Try to start with 1 player - should fail
      buttons = wrapper.findAll('button')
      startButton = buttons.wrappers.find(btn => btn.text().includes('Start Game'))
      await startButton.trigger('click')
      expect(wrapper.vm.started).toBe(false)

      // Add 2nd player
      createPlayer.vm.name = 'Bob'
      await wrapper.vm.$nextTick()
      createPlayer.vm.addPlayer()
      await wrapper.vm.$nextTick()

      // Now start should succeed
      buttons = wrapper.findAll('button')
      startButton = buttons.wrappers.find(btn => btn.text().includes('Start Game'))
      await startButton.trigger('click')
      expect(wrapper.vm.started).toBe(true)

      // Verify transition to game view
      expect(wrapper.findComponent(CreatePlayer).exists()).toBe(false)
      expect(wrapper.findComponent(PlayerList).exists()).toBe(false)
      expect(wrapper.findComponent(FarkleGame).exists()).toBe(true)
    })
  })
})
