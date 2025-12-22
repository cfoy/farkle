import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TieBreaker from '@/components/TieBreaker.vue'

describe('TieBreaker.vue', () => {
  let wrapper
  let players

  beforeEach(() => {
    players = [
      { name: 'Alice', score: 10000, onBoard: true },
      { name: 'Bob', score: 10000, onBoard: true },
      { name: 'Charlie', score: 8000, onBoard: true }
    ]

    wrapper = mount(TieBreaker, {
      propsData: {
        players,
        tiedPlayerIndices: [0, 1],
        highestScore: 10000
      },
      stubs: {
        'score': true
      }
    })
  })

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('displays "It\'s a Tie!" heading', () => {
    const heading = wrapper.find('h3')
    expect(heading.text()).toBe('It\'s a Tie!')
  })

  it('displays the highest score', () => {
    const text = wrapper.text()
    expect(text).toContain('10000 points')
  })

  it('displays instructions for tie-breaker', () => {
    const text = wrapper.text()
    expect(text).toContain('Roll a die to determine the winner')
  })

  it('renders buttons for tied players', () => {
    const buttons = wrapper.findAll('.btn')
    expect(buttons.length).toBe(2)
  })

  it('displays correct player names on buttons', () => {
    const buttons = wrapper.findAll('.btn')
    expect(buttons.at(0).text()).toContain('Alice')
    expect(buttons.at(1).text()).toContain('Bob')
  })

  it('displays scores on buttons', () => {
    const buttons = wrapper.findAll('.btn')
    expect(buttons.at(0).text()).toContain('10000 points')
    expect(buttons.at(1).text()).toContain('10000 points')
  })

  it('does not display button for non-tied player', () => {
    const text = wrapper.text()
    const buttons = wrapper.findAll('.btn')

    expect(buttons.length).toBe(2)
    expect(text).not.toContain('Charlie - 8000 points')
  })

  it('emits select-winner event when button clicked', async () => {
    const buttons = wrapper.findAll('.btn')
    await buttons.at(0).trigger('click')

    expect(wrapper.emitted('select-winner')).toBeTruthy()
    expect(wrapper.emitted('select-winner')[0]).toEqual([0])
  })

  it('emits correct player index when second button clicked', async () => {
    const buttons = wrapper.findAll('.btn')
    await buttons.at(1).trigger('click')

    expect(wrapper.emitted('select-winner')).toBeTruthy()
    expect(wrapper.emitted('select-winner')[0]).toEqual([1])
  })

  it('renders score component', () => {
    const scoreComponent = wrapper.findComponent({ name: 'score' })
    expect(scoreComponent.exists()).toBe(true)
  })

  it('handles three-way tie', () => {
    const threeWayWrapper = mount(TieBreaker, {
      propsData: {
        players: [
          { name: 'Alice', score: 10000 },
          { name: 'Bob', score: 10000 },
          { name: 'Charlie', score: 10000 }
        ],
        tiedPlayerIndices: [0, 1, 2],
        highestScore: 10000
      },
      stubs: {
        'score': true
      }
    })

    const buttons = threeWayWrapper.findAll('.btn')
    expect(buttons.length).toBe(3)
  })

  it('handles tie with different player indices', () => {
    const tieWrapper = mount(TieBreaker, {
      propsData: {
        players: [
          { name: 'Alice', score: 8000 },
          { name: 'Bob', score: 12000 },
          { name: 'Charlie', score: 12000 }
        ],
        tiedPlayerIndices: [1, 2],
        highestScore: 12000
      },
      stubs: {
        'score': true
      }
    })

    const buttons = tieWrapper.findAll('.btn')
    expect(buttons.length).toBe(2)
    expect(buttons.at(0).text()).toContain('Bob')
    expect(buttons.at(1).text()).toContain('Charlie')
  })

  it('emits correct index for non-sequential tied players', async () => {
    const tieWrapper = mount(TieBreaker, {
      propsData: {
        players: [
          { name: 'Alice', score: 8000 },
          { name: 'Bob', score: 12000 },
          { name: 'Charlie', score: 12000 }
        ],
        tiedPlayerIndices: [1, 2],
        highestScore: 12000
      },
      stubs: {
        'score': true
      }
    })

    const buttons = tieWrapper.findAll('.btn')
    await buttons.at(0).trigger('click')

    expect(tieWrapper.emitted('select-winner')).toBeTruthy()
    expect(tieWrapper.emitted('select-winner')[0]).toEqual([1])
  })

  it('displays score for tied players correctly', () => {
    const buttons = wrapper.findAll('.btn')
    expect(buttons.at(0).text()).toMatch(/Alice.*10000/)
    expect(buttons.at(1).text()).toMatch(/Bob.*10000/)
  })
})
