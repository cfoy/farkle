import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CreatePlayer from '@/components/CreatePlayer.vue'

describe('CreatePlayer.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(CreatePlayer)
  })

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('has a name input field', () => {
    const textField = wrapper.find('input[type="text"]')
    expect(textField.exists()).toBe(true)
  })

  it('emits create-player event with player data when name is provided', async () => {
    wrapper.setData({ name: 'Alice' })
    await wrapper.vm.$nextTick()

    wrapper.vm.addPlayer()
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('create-player')).toBeTruthy()
    expect(wrapper.emitted('create-player')[0][0]).toEqual({
      name: 'Alice',
      score: 0,
      onBoard: false,
      wins: 0
    })
  })

  it('clears the name field after adding a player', async () => {
    wrapper.setData({ name: 'Bob' })
    await wrapper.vm.$nextTick()

    wrapper.vm.addPlayer()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.name).toBe('')
  })

  it('does not emit create-player event when name is empty', async () => {
    wrapper.setData({ name: '' })
    await wrapper.vm.$nextTick()

    wrapper.vm.addPlayer()
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('create-player')).toBeFalsy()
  })

  it('does not emit create-player event when name is only whitespace', async () => {
    wrapper.setData({ name: '   ' })
    await wrapper.vm.$nextTick()

    wrapper.vm.addPlayer()
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('create-player')).toBeFalsy()
  })

  it('handles form submit event', async () => {
    wrapper.setData({ name: 'Charlie' })
    await wrapper.vm.$nextTick()

    const form = wrapper.find('form')
    await form.trigger('submit')

    expect(wrapper.emitted('create-player')).toBeTruthy()
    expect(wrapper.emitted('create-player')[0][0].name).toBe('Charlie')
  })

  describe('Win tracking with localStorage', () => {
    beforeEach(() => {
      // Clear localStorage before each test
      localStorage.clear()
    })

    it('initializes new player with 0 wins when no localStorage data exists', async () => {
      wrapper.setData({ name: 'NewPlayer' })
      await wrapper.vm.$nextTick()

      wrapper.vm.addPlayer()
      await wrapper.vm.$nextTick()

      const emittedPlayer = wrapper.emitted('create-player')[0][0]
      expect(emittedPlayer.wins).toBe(0)
    })

    it('loads existing wins from localStorage for known player', async () => {
      // Setup localStorage with existing win data
      localStorage.setItem('farkle-wins', JSON.stringify({
        'Alice': 5,
        'Bob': 3
      }))

      wrapper.setData({ name: 'Alice' })
      await wrapper.vm.$nextTick()

      wrapper.vm.addPlayer()
      await wrapper.vm.$nextTick()

      const emittedPlayer = wrapper.emitted('create-player')[0][0]
      expect(emittedPlayer.wins).toBe(5)
    })

    it('initializes with 0 wins for unknown player when localStorage has other players', async () => {
      localStorage.setItem('farkle-wins', JSON.stringify({
        'Alice': 5,
        'Bob': 3
      }))

      wrapper.setData({ name: 'Charlie' })
      await wrapper.vm.$nextTick()

      wrapper.vm.addPlayer()
      await wrapper.vm.$nextTick()

      const emittedPlayer = wrapper.emitted('create-player')[0][0]
      expect(emittedPlayer.wins).toBe(0)
    })

    it('handles corrupted localStorage data gracefully', async () => {
      localStorage.setItem('farkle-wins', 'invalid json')

      wrapper.setData({ name: 'Alice' })
      await wrapper.vm.$nextTick()

      wrapper.vm.addPlayer()
      await wrapper.vm.$nextTick()

      const emittedPlayer = wrapper.emitted('create-player')[0][0]
      expect(emittedPlayer.wins).toBe(0)
    })

    it('loads correct wins for multiple different players', async () => {
      localStorage.setItem('farkle-wins', JSON.stringify({
        'Alice': 10,
        'Bob': 7,
        'Charlie': 2
      }))

      // Add Alice
      wrapper.setData({ name: 'Alice' })
      await wrapper.vm.$nextTick()
      wrapper.vm.addPlayer()
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('create-player')[0][0].wins).toBe(10)

      // Add Bob
      wrapper.setData({ name: 'Bob' })
      await wrapper.vm.$nextTick()
      wrapper.vm.addPlayer()
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('create-player')[1][0].wins).toBe(7)
    })
  })
})
