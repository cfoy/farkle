import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Score from '@/components/Score.vue'

describe('Score.vue', () => {
  let wrapper
  let players

  beforeEach(() => {
    players = [
      { name: 'Alice', score: 1500, wins: 3 },
      { name: 'Bob', score: 2300, wins: 5 },
      { name: 'Charlie', score: 800, wins: 1 }
    ]

    wrapper = mount(Score, {
      propsData: { players }
    })
  })

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('displays the "Players" subheader', () => {
    const subheader = wrapper.find('.subheader')
    expect(subheader.text()).toBe('Players')
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

  it('displays player scores correctly', () => {
    const actions = wrapper.findAll('.list__tile__action')
    expect(actions.at(0).text()).toContain('1500')
    expect(actions.at(1).text()).toContain('2300')
    expect(actions.at(2).text()).toContain('800')
  })

  it('handles empty player list', () => {
    const emptyWrapper = mount(Score, {
      propsData: { players: [] }
    })

    const playerItems = emptyWrapper.findAll('.list__tile')
    expect(playerItems.length).toBe(0)
  })

  it('displays score of 0 correctly', () => {
    const zeroScorePlayers = [{ name: 'Test', score: 0 }]
    const zeroWrapper = mount(Score, {
      propsData: { players: zeroScorePlayers }
    })

    const action = zeroWrapper.find('.list__tile__action')
    expect(action.text()).toContain('0')
  })

  it('updates when player scores change', async () => {
    players[0].score = 3000
    await wrapper.vm.$nextTick()

    const actions = wrapper.findAll('.list__tile__action')
    expect(actions.at(0).text()).toContain('3000')
  })

  it('displays icon for each player', () => {
    const icons = wrapper.findAll('.icon')
    const faceIcons = icons.filter(icon => icon.text() === 'face')
    expect(faceIcons.length).toBe(3)
  })

  describe('Win tracking display', () => {
    it('displays wins count for each player', () => {
      const subTitles = wrapper.findAll('.list__tile__sub-title')
      expect(subTitles.at(0).text()).toContain('Wins: 3')
      expect(subTitles.at(1).text()).toContain('Wins: 5')
      expect(subTitles.at(2).text()).toContain('Wins: 1')
    })

    it('displays 0 wins for player with no wins', () => {
      const newPlayers = [{ name: 'NewPlayer', score: 100, wins: 0 }]
      const newWrapper = mount(Score, {
        propsData: { players: newPlayers }
      })

      const subTitle = newWrapper.find('.list__tile__sub-title')
      expect(subTitle.text()).toContain('Wins: 0')
    })

    it('displays high win counts correctly', () => {
      const highWinPlayers = [{ name: 'Champion', score: 5000, wins: 25 }]
      const newWrapper = mount(Score, {
        propsData: { players: highWinPlayers }
      })

      const subTitle = newWrapper.find('.list__tile__sub-title')
      expect(subTitle.text()).toContain('Wins: 25')
    })

    it('updates wins display when player wins change', async () => {
      players[0].wins = 10
      await wrapper.vm.$nextTick()

      const subTitle = wrapper.findAll('.list__tile__sub-title').at(0)
      expect(subTitle.text()).toContain('Wins: 10')
    })

    it('displays wins for all players in scoreboard', () => {
      const subTitles = wrapper.findAll('.list__tile__sub-title')
      expect(subTitles.length).toBe(3)

      subTitles.wrappers.forEach(subTitle => {
        expect(subTitle.text()).toContain('Wins:')
      })
    })
  })
})
