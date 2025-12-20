import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import FarkleTurn from '@/components/FarkleTurn.vue'

describe('FarkleTurn.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(FarkleTurn)
  })

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('initializes points to 0', () => {
    expect(wrapper.vm.points).toBe(0)
  })

  describe('Basic scoring', () => {
    it('adds 100 points for one', async () => {
      wrapper.vm.one()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.points).toBe(100)
    })

    it('adds 50 points for five', async () => {
      wrapper.vm.five()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.points).toBe(50)
    })

    it('accumulates points for multiple ones', async () => {
      wrapper.vm.one()
      wrapper.vm.one()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.points).toBe(200)
    })

    it('accumulates points for multiple fives', async () => {
      wrapper.vm.five()
      wrapper.vm.five()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.points).toBe(100)
    })
  })

  describe('Triple scoring', () => {
    it('adds 300 points for triple ones', async () => {
      wrapper.vm.tripleOnes()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.points).toBe(300)
    })

    it('adds 200 points for triple twos', async () => {
      wrapper.vm.tripleTwos()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.points).toBe(200)
    })

    it('adds 300 points for triple threes', async () => {
      wrapper.vm.tripleThrees()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.points).toBe(300)
    })

    it('adds 400 points for triple fours', async () => {
      wrapper.vm.tripleFours()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.points).toBe(400)
    })

    it('adds 500 points for triple fives', async () => {
      wrapper.vm.tripleFives()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.points).toBe(500)
    })

    it('adds 600 points for triple sixes', async () => {
      wrapper.vm.tripleSixes()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.points).toBe(600)
    })
  })

  describe('Special combinations', () => {
    it('adds 1000 points for four of a kind', async () => {
      wrapper.vm.fourOfAKind()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.points).toBe(1000)
    })

    it('adds 2000 points for five of a kind', async () => {
      wrapper.vm.fiveOfAKind()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.points).toBe(2000)
    })

    it('adds 3000 points for six of a kind', async () => {
      wrapper.vm.sixOfAKind()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.points).toBe(3000)
    })

    it('adds 1500 points for straight', async () => {
      wrapper.vm.straight()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.points).toBe(1500)
    })

    it('adds 1500 points for three pairs', async () => {
      wrapper.vm.threePairs()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.points).toBe(1500)
    })

    it('adds 1500 points for four of a kind plus a pair', async () => {
      wrapper.vm.fourPlusTwo()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.points).toBe(1500)
    })

    it('adds 2500 points for two three of a kinds', async () => {
      wrapper.vm.twoThreeOfAKind()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.points).toBe(2500)
    })
  })

  describe('Turn completion', () => {
    it('emits score event when done is called', async () => {
      wrapper.vm.points = 500
      wrapper.vm.done()
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('score')).toBeTruthy()
      expect(wrapper.emitted('score')[0][0]).toBe(500)
    })

    it('resets points to 0 after done is called', async () => {
      wrapper.vm.points = 500
      wrapper.vm.done()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.points).toBe(0)
    })

    it('handles farkle by resetting points to 0', async () => {
      wrapper.vm.points = 500
      wrapper.vm.farkle()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.points).toBe(0)
    })

    it('emits score event with 0 points on farkle', async () => {
      wrapper.vm.points = 500
      wrapper.vm.farkle()
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('score')).toBeTruthy()
      expect(wrapper.emitted('score')[0][0]).toBe(0)
    })
  })

  describe('Complex scoring scenarios', () => {
    it('accumulates multiple scoring actions correctly', async () => {
      wrapper.vm.one()
      wrapper.vm.five()
      wrapper.vm.tripleThrees()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.points).toBe(450)
    })

    it('handles large score accumulation', async () => {
      wrapper.vm.sixOfAKind()
      wrapper.vm.straight()
      wrapper.vm.twoThreeOfAKind()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.points).toBe(7000)
    })
  })
})
