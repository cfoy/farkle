import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { vuetifyStubs } from '../setup'
import Farkle from '@/components/Farkle.vue'
import CreatePlayer from '@/components/CreatePlayer.vue'
import PlayerList from '@/components/PlayerList.vue'

describe('Player Creation Workflow Integration', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Farkle, {
      global: {
        stubs: vuetifyStubs
      }
    })
  })

  it('adds player through CreatePlayer and updates PlayerList', async () => {
    // Initially, no players should be displayed
    const playerList = wrapper.findComponent(PlayerList)
    expect(wrapper.vm.players).toEqual([])

    // Find CreatePlayer component and add a player
    const createPlayer = wrapper.findComponent(CreatePlayer)
    createPlayer.vm.name = 'Alice'
    await wrapper.vm.$nextTick()

    createPlayer.vm.addPlayer()
    await wrapper.vm.$nextTick()

    // Verify player was added to parent's data
    expect(wrapper.vm.players.length).toBe(1)
    expect(wrapper.vm.players[0]).toEqual({ name: 'Alice', score: 0, onBoard: false, wins: 0 })

    // Verify PlayerList displays the new player
    const playerTiles = playerList.findAll('.list__tile__title')
    expect(playerTiles.length).toBe(1)
    expect(playerTiles.at(0).text()).toContain('Alice')
  })

  it('adds multiple players and displays them all in PlayerList', async () => {
    const createPlayer = wrapper.findComponent(CreatePlayer)

    // Add first player
    createPlayer.setData({ name: 'Alice' })
    await wrapper.vm.$nextTick()
    createPlayer.vm.addPlayer()
    await wrapper.vm.$nextTick()

    // Add second player
    createPlayer.vm.name = 'Bob'
    await wrapper.vm.$nextTick()
    createPlayer.vm.addPlayer()
    await wrapper.vm.$nextTick()

    // Add third player
    createPlayer.vm.name = 'Charlie'
    await wrapper.vm.$nextTick()
    createPlayer.vm.addPlayer()
    await wrapper.vm.$nextTick()

    // Verify all players were added to parent's data
    expect(wrapper.vm.players.length).toBe(3)
    expect(wrapper.vm.players[0].name).toBe('Alice')
    expect(wrapper.vm.players[1].name).toBe('Bob')
    expect(wrapper.vm.players[2].name).toBe('Charlie')

    // Verify all players are displayed in PlayerList
    const playerList = wrapper.findComponent(PlayerList)
    const playerTiles = playerList.findAll('.list__tile__title')
    expect(playerTiles.length).toBe(3)
    expect(playerTiles.at(0).text()).toContain('Alice')
    expect(playerTiles.at(1).text()).toContain('Bob')
    expect(playerTiles.at(2).text()).toContain('Charlie')
  })

  it('persists player data with correct initial score', async () => {
    const createPlayer = wrapper.findComponent(CreatePlayer)

    // Add players
    createPlayer.setData({ name: 'Alice' })
    await wrapper.vm.$nextTick()
    createPlayer.vm.addPlayer()
    await wrapper.vm.$nextTick()

    createPlayer.vm.name = 'Bob'
    await wrapper.vm.$nextTick()
    createPlayer.vm.addPlayer()
    await wrapper.vm.$nextTick()

    // Verify player data structure is correct
    expect(wrapper.vm.players).toEqual([
      { name: 'Alice', score: 0, onBoard: false, wins: 0 },
      { name: 'Bob', score: 0, onBoard: false, wins: 0 }
    ])
  })

  it('updates PlayerList reactively when players array changes', async () => {
    const playerList = wrapper.findComponent(PlayerList)

    // Start with no players
    expect(playerList.findAll('.list__tile').length).toBe(0)

    // Add a player directly to parent's data (testing reactivity)
    wrapper.vm.players.push({ name: 'Alice', score: 0 })
    await wrapper.vm.$nextTick()

    // PlayerList should update
    expect(playerList.findAll('.list__tile').length).toBe(1)

    // Add another player
    wrapper.vm.players.push({ name: 'Bob', score: 0 })
    await wrapper.vm.$nextTick()

    // PlayerList should show both
    expect(playerList.findAll('.list__tile').length).toBe(2)
  })

  it('clears CreatePlayer input after adding player while PlayerList updates', async () => {
    const createPlayer = wrapper.findComponent(CreatePlayer)

    createPlayer.vm.name = 'Alice'
    await wrapper.vm.$nextTick()

    createPlayer.vm.addPlayer()
    await wrapper.vm.$nextTick()

    // CreatePlayer input should be cleared
    expect(createPlayer.vm.name).toBe('')

    // But PlayerList should still show the player
    const playerList = wrapper.findComponent(PlayerList)
    const playerTiles = playerList.findAll('.list__tile__title')
    expect(playerTiles.length).toBe(1)
    expect(playerTiles.at(0).text()).toContain('Alice')
  })

  it('maintains player list after removing a player', async () => {
    // Add multiple players
    const createPlayer = wrapper.findComponent(CreatePlayer)

    createPlayer.setData({ name: 'Alice' })
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

    // Remove middle player through PlayerList
    const playerList = wrapper.findComponent(PlayerList)
    playerList.vm.removePlayer(1)
    await wrapper.vm.$nextTick()

    // Verify parent's data is updated
    expect(wrapper.vm.players.length).toBe(2)
    expect(wrapper.vm.players[0].name).toBe('Alice')
    expect(wrapper.vm.players[1].name).toBe('Charlie')

    // Verify PlayerList displays correctly
    const playerTiles = playerList.findAll('.list__tile__title')
    expect(playerTiles.length).toBe(2)
    expect(playerTiles.at(0).text()).toContain('Alice')
    expect(playerTiles.at(1).text()).toContain('Charlie')
  })
})
