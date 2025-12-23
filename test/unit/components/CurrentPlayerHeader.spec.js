import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { vuetifyStubs } from '../../setup'
import CurrentPlayerHeader from '@/components/CurrentPlayerHeader.vue'

describe('CurrentPlayerHeader.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(CurrentPlayerHeader, {
      global: {
        stubs: vuetifyStubs
      },
      props: { playerName: 'Alice' }
    })
  })

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('displays the current player name', () => {
    const header = wrapper.find('h5')
    expect(header.text()).toContain('Alice')
  })

  it('displays the full "Current Player:" label', () => {
    const header = wrapper.find('h5')
    expect(header.text()).toBe('Current Player: Alice')
  })

  it('updates when player name changes', async () => {
    wrapper.setProps({ playerName: 'Bob' })
    await wrapper.vm.$nextTick()

    const header = wrapper.find('h5')
    expect(header.text()).toBe('Current Player: Bob')
  })

  it('handles empty player name', () => {
    const emptyWrapper = mount(CurrentPlayerHeader, {
      props: { playerName: '' }
    })

    const header = emptyWrapper.find('h5')
    expect(header.text()).toBe('Current Player:')
  })
})
