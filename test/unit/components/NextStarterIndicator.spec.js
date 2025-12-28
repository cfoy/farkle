import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Score from '../../../src/components/Score.vue'
import { vuetifyStubs } from '../../setup'

describe('Score.vue - Next Starter Indicator', () => {
  const createWrapper = (players, nextStarterIndex = null) => {
    return mount(Score, {
      props: {
        players,
        nextStarterIndex
      },
      global: {
        stubs: vuetifyStubs
      }
    })
  }

  it('does not show "Plays Next" chip when nextStarterIndex is null', () => {
    const players = [
      { name: 'Alice', score: 5000, onBoard: true, wins: 0 },
      { name: 'Bob', score: 3000, onBoard: true, wins: 0 },
      { name: 'Charlie', score: 7000, onBoard: true, wins: 0 }
    ]

    const wrapper = createWrapper(players, null)
    const chips = wrapper.findAll('.v-chip')

    // Should only have on-board status chips, no "Plays Next" chip
    const playsNextChips = chips.filter(chip => chip.text().includes('Plays Next'))
    expect(playsNextChips.length).toBe(0)
  })

  it('shows "Plays Next" chip for designated next starter', () => {
    const players = [
      { name: 'Alice', score: 5000, onBoard: true, wins: 0 },
      { name: 'Bob', score: 3000, onBoard: true, wins: 0 },
      { name: 'Charlie', score: 7000, onBoard: true, wins: 0 }
    ]

    const wrapper = createWrapper(players, 1) // Bob will start next
    const chips = wrapper.findAll('.v-chip')

    const playsNextChips = chips.filter(chip => chip.text().includes('Plays Next'))
    expect(playsNextChips.length).toBe(1)
  })

  it('shows "Plays Next" chip for first player when index is 0', () => {
    const players = [
      { name: 'Alice', score: 5000, onBoard: true, wins: 0 },
      { name: 'Bob', score: 3000, onBoard: true, wins: 0 }
    ]

    const wrapper = createWrapper(players, 0)
    const listItems = wrapper.findAll('.v-list-item')

    // Check first player's list item contains "Plays Next"
    expect(listItems[0].text()).toContain('Alice')
    expect(listItems[0].text()).toContain('Plays Next')

    // Check second player's list item doesn't contain "Plays Next"
    expect(listItems[1].text()).toContain('Bob')
    expect(listItems[1].text()).not.toContain('Plays Next')
  })

  it('shows "Plays Next" chip for last player when index is last', () => {
    const players = [
      { name: 'Alice', score: 5000, onBoard: true, wins: 0 },
      { name: 'Bob', score: 3000, onBoard: true, wins: 0 },
      { name: 'Charlie', score: 7000, onBoard: true, wins: 0 }
    ]

    const wrapper = createWrapper(players, 2) // Charlie (last) will start next
    const listItems = wrapper.findAll('.v-list-item')

    // Check last player's list item contains "Plays Next"
    expect(listItems[2].text()).toContain('Charlie')
    expect(listItems[2].text()).toContain('Plays Next')

    // Check other players don't have "Plays Next"
    expect(listItems[0].text()).not.toContain('Plays Next')
    expect(listItems[1].text()).not.toContain('Plays Next')
  })

  it('shows exactly one "Plays Next" chip across all players', () => {
    const players = [
      { name: 'Alice', score: 5000, onBoard: true, wins: 0 },
      { name: 'Bob', score: 3000, onBoard: true, wins: 0 },
      { name: 'Charlie', score: 7000, onBoard: true, wins: 0 },
      { name: 'Dave', score: 4000, onBoard: true, wins: 0 }
    ]

    const wrapper = createWrapper(players, 2)
    const chips = wrapper.findAll('.v-chip')

    const playsNextChips = chips.filter(chip => chip.text().includes('Plays Next'))
    expect(playsNextChips.length).toBe(1)
  })

  it('does not show "Plays Next" for invalid index', () => {
    const players = [
      { name: 'Alice', score: 5000, onBoard: true, wins: 0 },
      { name: 'Bob', score: 3000, onBoard: true, wins: 0 }
    ]

    const wrapper = createWrapper(players, 5) // Invalid index
    const chips = wrapper.findAll('.v-chip')

    const playsNextChips = chips.filter(chip => chip.text().includes('Plays Next'))
    expect(playsNextChips.length).toBe(0)
  })

  it('shows both on-board status and "Plays Next" chip for same player', () => {
    const players = [
      { name: 'Alice', score: 5000, onBoard: true, wins: 0 },
      { name: 'Bob', score: 3000, onBoard: true, wins: 0 }
    ]

    const wrapper = createWrapper(players, 0)
    const listItems = wrapper.findAll('.v-list-item')

    // Alice should have both "On Board" and "Plays Next" chips
    expect(listItems[0].text()).toContain('Alice')
    expect(listItems[0].text()).toContain('On Board')
    expect(listItems[0].text()).toContain('Plays Next')
  })

  it('updates when nextStarterIndex prop changes', async () => {
    const players = [
      { name: 'Alice', score: 5000, onBoard: true, wins: 0 },
      { name: 'Bob', score: 3000, onBoard: true, wins: 0 },
      { name: 'Charlie', score: 7000, onBoard: true, wins: 0 }
    ]

    const wrapper = createWrapper(players, 1)

    // Initially Bob has "Plays Next"
    let listItems = wrapper.findAll('.v-list-item')
    expect(listItems[1].text()).toContain('Plays Next')
    expect(listItems[0].text()).not.toContain('Plays Next')

    // Update to Alice
    await wrapper.setProps({ nextStarterIndex: 0 })
    listItems = wrapper.findAll('.v-list-item')

    // Now Alice has "Plays Next"
    expect(listItems[0].text()).toContain('Plays Next')
    expect(listItems[1].text()).not.toContain('Plays Next')
  })
})
