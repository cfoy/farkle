import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ActiveGame from '@/components/ActiveGame.vue'

describe('ActiveGame.vue', () => {
  let wrapper
  let players
  let currentPlayer

  beforeEach(() => {
    players = [
      { name: 'Alice', score: 500, onBoard: true },
      { name: 'Bob', score: 300, onBoard: true },
      { name: 'Charlie', score: 0, onBoard: false }
    ]

    currentPlayer = players[0]

    wrapper = mount(ActiveGame, {
      propsData: {
        currentPlayer,
        currentPlayerName: 'Alice',
        players
      },
      stubs: {
        'farkle-turn': true,
        'score': true
      }
    })
  })

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('renders farkle-turn component', () => {
    const farkleTurnComponent = wrapper.findComponent({ name: 'farkle-turn' })
    expect(farkleTurnComponent.exists()).toBe(true)
  })

  it('renders score component', () => {
    const scoreComponent = wrapper.findComponent({ name: 'score' })
    expect(scoreComponent.exists()).toBe(true)
  })

  it('passes currentPlayer prop to farkle-turn', () => {
    const farkleTurnComponent = wrapper.findComponent({ name: 'farkle-turn' })
    expect(farkleTurnComponent.props('currentPlayer')).toBe(currentPlayer)
  })

  it('passes players prop to score component', () => {
    const scoreComponent = wrapper.findComponent({ name: 'score' })
    expect(scoreComponent.props('players')).toBe(players)
  })

  it('emits score event when farkle-turn emits score', async () => {
    const farkleTurnComponent = wrapper.findComponent({ name: 'farkle-turn' })
    farkleTurnComponent.vm.$emit('score', 500)
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('score')).toBeTruthy()
    expect(wrapper.emitted('score')[0]).toEqual([500])
  })

  it('forwards different score values correctly', async () => {
    const farkleTurnComponent = wrapper.findComponent({ name: 'farkle-turn' })

    farkleTurnComponent.vm.$emit('score', 100)
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('score')[0]).toEqual([100])

    farkleTurnComponent.vm.$emit('score', 1000)
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('score')[1]).toEqual([1000])
  })

  it('forwards farkle (0 points) correctly', async () => {
    const farkleTurnComponent = wrapper.findComponent({ name: 'farkle-turn' })
    farkleTurnComponent.vm.$emit('score', 0)
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('score')).toBeTruthy()
    expect(wrapper.emitted('score')[0]).toEqual([0])
  })

  it('updates when currentPlayer changes', async () => {
    wrapper.setProps({ currentPlayer: players[1], currentPlayerName: 'Bob' })
    await wrapper.vm.$nextTick()

    const farkleTurnComponent = wrapper.findComponent({ name: 'farkle-turn' })
    expect(farkleTurnComponent.props('currentPlayer')).toBe(players[1])
  })

  it('uses Vuetify layout components', () => {
    const html = wrapper.html()
    expect(html).toContain('class="layout')
    expect(html).toContain('class="flex')
    expect(html).toContain('class="card')
  })

  it('displays components in a row layout', () => {
    const html = wrapper.html()
    expect(html).toContain('row')
  })

  it('has two flex columns', () => {
    const flexElements = wrapper.findAll('.flex')
    expect(flexElements.length).toBeGreaterThanOrEqual(2)
  })

  it('wraps farkle-turn in a card', () => {
    const cards = wrapper.findAll('.card')
    expect(cards.length).toBeGreaterThanOrEqual(2)
  })

  it('wraps score component in a card', () => {
    const cards = wrapper.findAll('.card')
    expect(cards.length).toBeGreaterThanOrEqual(2)
  })

  it('handles currentPlayer with no score', () => {
    const newWrapper = mount(ActiveGame, {
      propsData: {
        currentPlayer: players[2],
        currentPlayerName: 'Charlie',
        players
      },
      stubs: {
        'farkle-turn': true,
        'score': true
      }
    })

    const farkleTurnComponent = newWrapper.findComponent({ name: 'farkle-turn' })
    expect(farkleTurnComponent.props('currentPlayer')).toBe(players[2])
  })

  it('emits multiple score events correctly', async () => {
    const farkleTurnComponent = wrapper.findComponent({ name: 'farkle-turn' })

    farkleTurnComponent.vm.$emit('score', 50)
    await wrapper.vm.$nextTick()

    farkleTurnComponent.vm.$emit('score', 100)
    await wrapper.vm.$nextTick()

    farkleTurnComponent.vm.$emit('score', 200)
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('score')).toBeTruthy()
    expect(wrapper.emitted('score').length).toBe(3)
    expect(wrapper.emitted('score')[0]).toEqual([50])
    expect(wrapper.emitted('score')[1]).toEqual([100])
    expect(wrapper.emitted('score')[2]).toEqual([200])
  })

  it('maintains component structure with different players', async () => {
    wrapper.setProps({
      currentPlayer: players[1],
      currentPlayerName: 'Bob',
      players: [players[1]]
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent({ name: 'farkle-turn' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'score' }).exists()).toBe(true)
  })
})
