import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PlayerList from '@/components/PlayerList.vue'

describe('PlayerList.vue', () => {
  let wrapper
  let players

  beforeEach(() => {
    players = [
      { name: 'Alice', score: 0 },
      { name: 'Bob', score: 0 },
      { name: 'Charlie', score: 0 }
    ]

    wrapper = mount(PlayerList, {
      propsData: { players }
    })
  })

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('displays all players', () => {
    const playerItems = wrapper.findAll('.list__tile')
    expect(playerItems.length).toBe(3)
  })

  it('displays player names correctly', () => {
    const tiles = wrapper.findAll('.list__tile__title')
    expect(tiles.at(0).text()).toContain('Alice')
    expect(tiles.at(1).text()).toContain('Bob')
    expect(tiles.at(2).text()).toContain('Charlie')
  })

  it('displays the "Players" subheader', () => {
    const subheader = wrapper.find('.subheader')
    expect(subheader.text()).toBe('Players')
  })

  it('has remove button for each player', () => {
    const removeIcons = wrapper.findAll('.icon')
    const clearIcons = removeIcons.filter(icon => icon.text() === 'clear')
    expect(clearIcons.length).toBe(3)
  })

  it('removes player when remove icon is clicked', async () => {
    expect(players.length).toBe(3)

    wrapper.vm.removePlayer(1)
    await wrapper.vm.$nextTick()

    expect(players.length).toBe(2)
    expect(players[0].name).toBe('Alice')
    expect(players[1].name).toBe('Charlie')
  })

  it('removes the correct player', async () => {
    wrapper.vm.removePlayer(0)
    await wrapper.vm.$nextTick()

    expect(players.length).toBe(2)
    expect(players[0].name).toBe('Bob')
    expect(players[1].name).toBe('Charlie')
  })

  it('handles empty player list', () => {
    const emptyWrapper = mount(PlayerList, {
      propsData: { players: [] }
    })

    const playerItems = emptyWrapper.findAll('.list__tile')
    expect(playerItems.length).toBe(0)
  })
})
