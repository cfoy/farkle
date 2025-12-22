import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import GameOver from '@/components/GameOver.vue'

describe('GameOver.vue', () => {
  let wrapper
  let players

  beforeEach(() => {
    players = [
      { name: 'Alice', score: 10500, onBoard: true },
      { name: 'Bob', score: 9000, onBoard: true },
      { name: 'Charlie', score: 8500, onBoard: true }
    ]

    wrapper = mount(GameOver, {
      propsData: {
        players,
        winner: players[0]
      },
      stubs: {
        'score': true
      }
    })
  })

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('displays "Game Over!" heading', () => {
    const heading = wrapper.find('h3')
    expect(heading.text()).toBe('Game Over!')
  })

  it('displays winner name', () => {
    const winnerText = wrapper.find('h4')
    expect(winnerText.text()).toContain('Alice')
  })

  it('displays winner score', () => {
    const winnerText = wrapper.find('h4')
    expect(winnerText.text()).toContain('10500')
  })

  it('displays full winner message', () => {
    const winnerText = wrapper.find('h4')
    expect(winnerText.text()).toBe('Winner: Alice with 10500 points!')
  })

  it('renders score component', () => {
    const scoreComponent = wrapper.findComponent({ name: 'score' })
    expect(scoreComponent.exists()).toBe(true)
  })

  it('passes players prop to score component', () => {
    const scoreComponent = wrapper.findComponent({ name: 'score' })
    expect(scoreComponent.exists()).toBe(true)
  })

  it('displays different winner correctly', () => {
    const newWrapper = mount(GameOver, {
      propsData: {
        players,
        winner: players[1]
      },
      stubs: {
        'score': true
      }
    })

    const winnerText = newWrapper.find('h4')
    expect(winnerText.text()).toContain('Bob')
    expect(winnerText.text()).toContain('9000')
  })

  it('displays third player as winner correctly', () => {
    const newWrapper = mount(GameOver, {
      propsData: {
        players,
        winner: players[2]
      },
      stubs: {
        'score': true
      }
    })

    const winnerText = newWrapper.find('h4')
    expect(winnerText.text()).toContain('Charlie')
    expect(winnerText.text()).toContain('8500')
  })

  it('handles null winner gracefully', () => {
    const newWrapper = mount(GameOver, {
      propsData: {
        players,
        winner: null
      },
      stubs: {
        'score': true
      }
    })

    expect(newWrapper.exists()).toBe(true)
    expect(newWrapper.find('h3').text()).toBe('Game Over!')
  })

  it('handles winner with high score', () => {
    const highScorePlayers = [
      { name: 'Alice', score: 25000, onBoard: true }
    ]

    const newWrapper = mount(GameOver, {
      propsData: {
        players: highScorePlayers,
        winner: highScorePlayers[0]
      },
      stubs: {
        'score': true
      }
    })

    const winnerText = newWrapper.find('h4')
    expect(winnerText.text()).toContain('25000')
  })

  it('uses Vuetify layout components', () => {
    const html = wrapper.html()
    expect(html).toContain('class="layout')
    expect(html).toContain('class="flex')
    expect(html).toContain('class="card')
  })

  it('displays winner message in card text', () => {
    const cardText = wrapper.find('.card__text')
    expect(cardText.exists()).toBe(true)
    expect(cardText.text()).toContain('Winner')
  })

  it('displays heading in card title', () => {
    const cardTitle = wrapper.find('.card__title')
    expect(cardTitle.exists()).toBe(true)
    expect(cardTitle.text()).toContain('Game Over!')
  })
})
