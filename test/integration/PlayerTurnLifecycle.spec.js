import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import FarkleGame from '@/components/FarkleGame.vue'
import FarkleTurn from '@/components/FarkleTurn.vue'
import Score from '@/components/Score.vue'

describe('Complete Player Turn Lifecycle Integration', () => {
  let wrapper
  let players

  beforeEach(() => {
    players = [
      { name: 'Alice', score: 0 },
      { name: 'Bob', score: 0 },
      { name: 'Charlie', score: 0 }
    ]
    wrapper = mount(FarkleGame, {
      propsData: { players }
    })
  })

  describe('Single turn complete flow', () => {
    it('completes full turn: scoring → accumulation → done → score update → rotation → display', async () => {
      const farkleTurn = wrapper.findComponent(FarkleTurn)
      const scoreComponent = wrapper.findComponent(Score)

      // Initial state
      expect(wrapper.vm.currentPlayer).toBe(0)
      expect(wrapper.vm.currentPlayerName).toBe('Alice')
      expect(farkleTurn.vm.points).toBe(0)
      expect(players[0].score).toBe(0)

      // Step 1: FarkleTurn scoring actions
      farkleTurn.vm.one()
      await wrapper.vm.$nextTick()
      expect(farkleTurn.vm.points).toBe(100)

      farkleTurn.vm.one()
      await wrapper.vm.$nextTick()
      expect(farkleTurn.vm.points).toBe(200)

      farkleTurn.vm.five()
      await wrapper.vm.$nextTick()
      expect(farkleTurn.vm.points).toBe(250)

      // Step 2: Points accumulated in FarkleTurn
      expect(farkleTurn.vm.points).toBe(250)

      // Step 3: Done event emission
      farkleTurn.vm.done()
      await wrapper.vm.$nextTick()

      // Step 4: FarkleGame score update
      expect(players[0].score).toBe(250)

      // Step 5: Player rotation
      expect(wrapper.vm.currentPlayer).toBe(1)
      expect(wrapper.vm.currentPlayerName).toBe('Bob')

      // Step 6: Score display update
      const scoreTiles = scoreComponent.findAll('.list__tile__action')
      expect(scoreTiles.at(0).text()).toContain('250')
      expect(scoreTiles.at(1).text()).toContain('0')
      expect(scoreTiles.at(2).text()).toContain('0')

      // FarkleTurn points should be reset
      expect(farkleTurn.vm.points).toBe(0)
    })

    it('completes turn with triple scoring', async () => {
      const farkleTurn = wrapper.findComponent(FarkleTurn)
      const scoreComponent = wrapper.findComponent(Score)

      expect(wrapper.vm.currentPlayerName).toBe('Alice')

      // Score triple threes (300) + two ones (200)
      farkleTurn.vm.tripleThrees()
      await wrapper.vm.$nextTick()
      farkleTurn.vm.one()
      await wrapper.vm.$nextTick()
      farkleTurn.vm.one()
      await wrapper.vm.$nextTick()

      expect(farkleTurn.vm.points).toBe(500)

      // Complete turn
      farkleTurn.vm.done()
      await wrapper.vm.$nextTick()

      // Verify updates
      expect(players[0].score).toBe(500)
      expect(wrapper.vm.currentPlayer).toBe(1)
      expect(farkleTurn.vm.points).toBe(0)

      const scoreTiles = scoreComponent.findAll('.list__tile__action')
      expect(scoreTiles.at(0).text()).toContain('500')
    })

    it('completes turn with special combinations', async () => {
      const farkleTurn = wrapper.findComponent(FarkleTurn)
      const scoreComponent = wrapper.findComponent(Score)

      // Score straight (1500)
      farkleTurn.vm.straight()
      await wrapper.vm.$nextTick()
      expect(farkleTurn.vm.points).toBe(1500)

      // Complete turn
      farkleTurn.vm.done()
      await wrapper.vm.$nextTick()

      // Verify updates
      expect(players[0].score).toBe(1500)
      expect(wrapper.vm.currentPlayer).toBe(1)
      expect(wrapper.vm.currentPlayerName).toBe('Bob')
      expect(farkleTurn.vm.points).toBe(0)

      const scoreTiles = scoreComponent.findAll('.list__tile__action')
      expect(scoreTiles.at(0).text()).toContain('1500')
    })
  })

  describe('Multiple turns flow', () => {
    it('completes turns for all three players in sequence', async () => {
      const farkleTurn = wrapper.findComponent(FarkleTurn)
      const scoreComponent = wrapper.findComponent(Score)

      // Alice's turn
      expect(wrapper.vm.currentPlayerName).toBe('Alice')
      farkleTurn.vm.one()
      farkleTurn.vm.five()
      await wrapper.vm.$nextTick()
      expect(farkleTurn.vm.points).toBe(150)
      farkleTurn.vm.done()
      await wrapper.vm.$nextTick()

      expect(players[0].score).toBe(150)
      expect(wrapper.vm.currentPlayerName).toBe('Bob')
      expect(farkleTurn.vm.points).toBe(0)

      // Bob's turn
      farkleTurn.vm.tripleOnes()
      await wrapper.vm.$nextTick()
      expect(farkleTurn.vm.points).toBe(300)
      farkleTurn.vm.done()
      await wrapper.vm.$nextTick()

      expect(players[1].score).toBe(300)
      expect(wrapper.vm.currentPlayerName).toBe('Charlie')
      expect(farkleTurn.vm.points).toBe(0)

      // Charlie's turn
      farkleTurn.vm.tripleFives()
      farkleTurn.vm.one()
      await wrapper.vm.$nextTick()
      expect(farkleTurn.vm.points).toBe(600)
      farkleTurn.vm.done()
      await wrapper.vm.$nextTick()

      expect(players[2].score).toBe(600)
      expect(wrapper.vm.currentPlayerName).toBe('Alice') // Wrapped around
      expect(farkleTurn.vm.points).toBe(0)

      // Verify all scores in Score component
      const scoreTiles = scoreComponent.findAll('.list__tile__action')
      expect(scoreTiles.at(0).text()).toContain('150')
      expect(scoreTiles.at(1).text()).toContain('300')
      expect(scoreTiles.at(2).text()).toContain('600')
    })

    it('accumulates scores across multiple rounds', async () => {
      const farkleTurn = wrapper.findComponent(FarkleTurn)
      const scoreComponent = wrapper.findComponent(Score)

      // Round 1
      farkleTurn.vm.one() // Alice: 100
      farkleTurn.vm.done()
      await wrapper.vm.$nextTick()

      farkleTurn.vm.five() // Bob: 50
      farkleTurn.vm.done()
      await wrapper.vm.$nextTick()

      farkleTurn.vm.tripleThrees() // Charlie: 300
      farkleTurn.vm.done()
      await wrapper.vm.$nextTick()

      expect(players[0].score).toBe(100)
      expect(players[1].score).toBe(50)
      expect(players[2].score).toBe(300)

      // Round 2
      farkleTurn.vm.tripleFives() // Alice: 100 + 500 = 600
      farkleTurn.vm.done()
      await wrapper.vm.$nextTick()

      farkleTurn.vm.one()
      farkleTurn.vm.five() // Bob: 50 + 150 = 200
      farkleTurn.vm.done()
      await wrapper.vm.$nextTick()

      farkleTurn.vm.straight() // Charlie: 300 + 1500 = 1800
      farkleTurn.vm.done()
      await wrapper.vm.$nextTick()

      // Verify accumulated scores
      expect(players[0].score).toBe(600)
      expect(players[1].score).toBe(200)
      expect(players[2].score).toBe(1800)

      const scoreTiles = scoreComponent.findAll('.list__tile__action')
      expect(scoreTiles.at(0).text()).toContain('600')
      expect(scoreTiles.at(1).text()).toContain('200')
      expect(scoreTiles.at(2).text()).toContain('1800')
    })
  })

  describe('Farkle flow', () => {
    it('handles farkle: reset points → emit 0 → update score → rotate', async () => {
      const farkleTurn = wrapper.findComponent(FarkleTurn)
      const scoreComponent = wrapper.findComponent(Score)

      expect(wrapper.vm.currentPlayerName).toBe('Alice')

      // Accumulate some points
      farkleTurn.vm.one()
      farkleTurn.vm.five()
      farkleTurn.vm.tripleThrees()
      await wrapper.vm.$nextTick()
      expect(farkleTurn.vm.points).toBe(450)

      // Farkle!
      farkleTurn.vm.farkle()
      await wrapper.vm.$nextTick()

      // FarkleTurn points reset
      expect(farkleTurn.vm.points).toBe(0)

      // Player score unchanged (added 0)
      expect(players[0].score).toBe(0)

      // Player rotation happened
      expect(wrapper.vm.currentPlayer).toBe(1)
      expect(wrapper.vm.currentPlayerName).toBe('Bob')

      // Score display unchanged
      const scoreTiles = scoreComponent.findAll('.list__tile__action')
      expect(scoreTiles.at(0).text()).toContain('0')
    })

    it('handles farkle after previous scoring turns', async () => {
      const farkleTurn = wrapper.findComponent(FarkleTurn)

      // Alice scores normally
      farkleTurn.vm.tripleOnes()
      farkleTurn.vm.done()
      await wrapper.vm.$nextTick()
      expect(players[0].score).toBe(300)

      // Bob farkles with accumulated points
      farkleTurn.vm.tripleSixes()
      farkleTurn.vm.one()
      await wrapper.vm.$nextTick()
      expect(farkleTurn.vm.points).toBe(700)

      farkleTurn.vm.farkle()
      await wrapper.vm.$nextTick()

      // Bob's score remains 0
      expect(players[1].score).toBe(0)
      expect(farkleTurn.vm.points).toBe(0)

      // Turn rotated to Charlie
      expect(wrapper.vm.currentPlayerName).toBe('Charlie')
    })
  })

  describe('Complex scoring scenarios', () => {
    it('handles large scoring turn with multiple actions', async () => {
      const farkleTurn = wrapper.findComponent(FarkleTurn)
      const scoreComponent = wrapper.findComponent(Score)

      // Accumulate large score
      farkleTurn.vm.sixOfAKind() // 3000
      farkleTurn.vm.one() // 100
      farkleTurn.vm.five() // 50
      await wrapper.vm.$nextTick()
      expect(farkleTurn.vm.points).toBe(3150)

      farkleTurn.vm.done()
      await wrapper.vm.$nextTick()

      expect(players[0].score).toBe(3150)
      expect(wrapper.vm.currentPlayer).toBe(1)
      expect(farkleTurn.vm.points).toBe(0)

      const scoreTiles = scoreComponent.findAll('.list__tile__action')
      expect(scoreTiles.at(0).text()).toContain('3150')
    })

    it('completes game to winning score with lifecycle verification', async () => {
      const farkleTurn = wrapper.findComponent(FarkleTurn)
      const scoreComponent = wrapper.findComponent(Score)

      // Set players near winning score
      players[0].score = 9500
      players[1].score = 9700
      players[2].score = 9300
      await wrapper.vm.$nextTick()

      // Alice's turn - reaches winning score
      farkleTurn.vm.sixOfAKind()
      await wrapper.vm.$nextTick()
      expect(farkleTurn.vm.points).toBe(3000)

      farkleTurn.vm.done()
      await wrapper.vm.$nextTick()

      // Alice now has 12500 points
      expect(players[0].score).toBe(12500)
      expect(wrapper.vm.currentPlayer).toBe(1)
      expect(farkleTurn.vm.points).toBe(0)

      const scoreTiles = scoreComponent.findAll('.list__tile__action')
      expect(scoreTiles.at(0).text()).toContain('12500')
      expect(scoreTiles.at(1).text()).toContain('9700')
      expect(scoreTiles.at(2).text()).toContain('9300')
    })
  })

  describe('Turn state isolation', () => {
    it('ensures FarkleTurn points reset after each turn', async () => {
      const farkleTurn = wrapper.findComponent(FarkleTurn)

      // Alice's turn
      farkleTurn.vm.tripleOnes()
      await wrapper.vm.$nextTick()
      expect(farkleTurn.vm.points).toBe(300)
      farkleTurn.vm.done()
      await wrapper.vm.$nextTick()
      expect(farkleTurn.vm.points).toBe(0)

      // Bob starts fresh
      expect(farkleTurn.vm.points).toBe(0)
      farkleTurn.vm.tripleFives()
      await wrapper.vm.$nextTick()
      expect(farkleTurn.vm.points).toBe(500)
      farkleTurn.vm.done()
      await wrapper.vm.$nextTick()
      expect(farkleTurn.vm.points).toBe(0)

      // Charlie starts fresh
      expect(farkleTurn.vm.points).toBe(0)
    })

    it('maintains player scores independently of FarkleTurn state', async () => {
      const farkleTurn = wrapper.findComponent(FarkleTurn)

      // Alice scores
      farkleTurn.vm.one()
      farkleTurn.vm.done()
      await wrapper.vm.$nextTick()

      expect(players[0].score).toBe(100)
      expect(farkleTurn.vm.points).toBe(0)

      // Bob accumulates points but doesn't finish yet
      farkleTurn.vm.tripleThrees()
      await wrapper.vm.$nextTick()
      expect(farkleTurn.vm.points).toBe(300)

      // Alice's score unchanged
      expect(players[0].score).toBe(100)

      // Bob completes turn
      farkleTurn.vm.done()
      await wrapper.vm.$nextTick()

      expect(players[0].score).toBe(100) // Still unchanged
      expect(players[1].score).toBe(300) // Now updated
    })
  })

  describe('Full game simulation', () => {
    it('simulates 3 complete rounds with all components interacting', async () => {
      const farkleTurn = wrapper.findComponent(FarkleTurn)
      const scoreComponent = wrapper.findComponent(Score)

      // Round 1
      farkleTurn.vm.one()
      farkleTurn.vm.done()
      await wrapper.vm.$nextTick()

      farkleTurn.vm.five()
      farkleTurn.vm.done()
      await wrapper.vm.$nextTick()

      farkleTurn.vm.tripleOnes()
      farkleTurn.vm.done()
      await wrapper.vm.$nextTick()

      // Round 2
      farkleTurn.vm.tripleFives()
      farkleTurn.vm.done()
      await wrapper.vm.$nextTick()

      farkleTurn.vm.farkle() // Bob farkles
      await wrapper.vm.$nextTick()

      farkleTurn.vm.straight()
      farkleTurn.vm.done()
      await wrapper.vm.$nextTick()

      // Round 3
      farkleTurn.vm.sixOfAKind()
      farkleTurn.vm.done()
      await wrapper.vm.$nextTick()

      farkleTurn.vm.twoThreeOfAKind()
      farkleTurn.vm.done()
      await wrapper.vm.$nextTick()

      farkleTurn.vm.threePairs()
      farkleTurn.vm.done()
      await wrapper.vm.$nextTick()

      // Verify final scores
      // Alice: 100 + 500 + 3000 = 3600
      // Bob: 50 + 0 + 2500 = 2550
      // Charlie: 300 + 1500 + 1500 = 3300
      expect(players[0].score).toBe(3600)
      expect(players[1].score).toBe(2550)
      expect(players[2].score).toBe(3300)

      const scoreTiles = scoreComponent.findAll('.list__tile__action')
      expect(scoreTiles.at(0).text()).toContain('3600')
      expect(scoreTiles.at(1).text()).toContain('2550')
      expect(scoreTiles.at(2).text()).toContain('3300')

      // Back to Alice's turn
      expect(wrapper.vm.currentPlayerName).toBe('Alice')
    })
  })
})
