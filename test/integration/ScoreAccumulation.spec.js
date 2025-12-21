import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import FarkleGame from '@/components/FarkleGame.vue'
import Score from '@/components/Score.vue'
import FarkleTurn from '@/components/FarkleTurn.vue'

describe('Score Accumulation Integration', () => {
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

  describe('Initial score display', () => {
    it('displays Score component with all players at 0 points', () => {
      const scoreComponent = wrapper.findComponent(Score)
      expect(scoreComponent.exists()).toBe(true)
      expect(scoreComponent.props('players')).toEqual(players)

      const scoreTiles = scoreComponent.findAll('.list__tile__action')
      expect(scoreTiles.length).toBe(3)
      expect(scoreTiles.at(0).text()).toContain('0')
      expect(scoreTiles.at(1).text()).toContain('0')
      expect(scoreTiles.at(2).text()).toContain('0')
    })

    it('displays all player names in Score component', () => {
      const scoreComponent = wrapper.findComponent(Score)
      const nameTiles = scoreComponent.findAll('.list__tile__title')

      expect(nameTiles.at(0).text()).toContain('Alice')
      expect(nameTiles.at(1).text()).toContain('Bob')
      expect(nameTiles.at(2).text()).toContain('Charlie')
    })
  })

  describe('Score updates during gameplay', () => {
    it('updates Score component when first player scores', async () => {
      const scoreComponent = wrapper.findComponent(Score)
      const farkleTurn = wrapper.findComponent(FarkleTurn)

      // Alice scores 150 points
      farkleTurn.vm.$emit('score', 150)
      await wrapper.vm.$nextTick()

      // Score component should reflect the update
      const scoreTiles = scoreComponent.findAll('.list__tile__action')
      expect(scoreTiles.at(0).text()).toContain('150')
      expect(scoreTiles.at(1).text()).toContain('0')
      expect(scoreTiles.at(2).text()).toContain('0')
    })

    it('updates Score component when second player scores', async () => {
      const scoreComponent = wrapper.findComponent(Score)
      const farkleTurn = wrapper.findComponent(FarkleTurn)

      // Alice scores
      farkleTurn.vm.$emit('score', 100)
      await wrapper.vm.$nextTick()

      // Bob scores
      farkleTurn.vm.$emit('score', 200)
      await wrapper.vm.$nextTick()

      // Score component should show both scores
      const scoreTiles = scoreComponent.findAll('.list__tile__action')
      expect(scoreTiles.at(0).text()).toContain('100')
      expect(scoreTiles.at(1).text()).toContain('200')
      expect(scoreTiles.at(2).text()).toContain('0')
    })

    it('updates Score component for all three players', async () => {
      const scoreComponent = wrapper.findComponent(Score)
      const farkleTurn = wrapper.findComponent(FarkleTurn)

      // All three players score
      farkleTurn.vm.$emit('score', 100) // Alice
      await wrapper.vm.$nextTick()
      farkleTurn.vm.$emit('score', 200) // Bob
      await wrapper.vm.$nextTick()
      farkleTurn.vm.$emit('score', 300) // Charlie
      await wrapper.vm.$nextTick()

      // Score component should show all three scores
      const scoreTiles = scoreComponent.findAll('.list__tile__action')
      expect(scoreTiles.at(0).text()).toContain('100')
      expect(scoreTiles.at(1).text()).toContain('200')
      expect(scoreTiles.at(2).text()).toContain('300')
    })
  })

  describe('Score accumulation across multiple turns', () => {
    it('accumulates scores across multiple rounds', async () => {
      const scoreComponent = wrapper.findComponent(Score)
      const farkleTurn = wrapper.findComponent(FarkleTurn)

      // Round 1
      farkleTurn.vm.$emit('score', 100) // Alice: 100
      await wrapper.vm.$nextTick()
      farkleTurn.vm.$emit('score', 150) // Bob: 150
      await wrapper.vm.$nextTick()
      farkleTurn.vm.$emit('score', 200) // Charlie: 200
      await wrapper.vm.$nextTick()

      let scoreTiles = scoreComponent.findAll('.list__tile__action')
      expect(scoreTiles.at(0).text()).toContain('100')
      expect(scoreTiles.at(1).text()).toContain('150')
      expect(scoreTiles.at(2).text()).toContain('200')

      // Round 2
      farkleTurn.vm.$emit('score', 250) // Alice: 100 + 250 = 350
      await wrapper.vm.$nextTick()
      farkleTurn.vm.$emit('score', 100) // Bob: 150 + 100 = 250
      await wrapper.vm.$nextTick()
      farkleTurn.vm.$emit('score', 300) // Charlie: 200 + 300 = 500
      await wrapper.vm.$nextTick()

      scoreTiles = scoreComponent.findAll('.list__tile__action')
      expect(scoreTiles.at(0).text()).toContain('350')
      expect(scoreTiles.at(1).text()).toContain('250')
      expect(scoreTiles.at(2).text()).toContain('500')
    })

    it('tracks accumulated scores over many rounds', async () => {
      const scoreComponent = wrapper.findComponent(Score)
      const farkleTurn = wrapper.findComponent(FarkleTurn)

      // Simulate 5 complete rounds
      const roundScores = [
        [100, 200, 150], // Round 1
        [50, 100, 200],  // Round 2
        [300, 0, 100],   // Round 3
        [150, 250, 50],  // Round 4
        [200, 150, 300]  // Round 5
      ]

      for (const round of roundScores) {
        for (const score of round) {
          farkleTurn.vm.$emit('score', score)
          await wrapper.vm.$nextTick()
        }
      }

      // Calculate expected totals
      const expectedScores = [800, 700, 800]

      const scoreTiles = scoreComponent.findAll('.list__tile__action')
      expect(scoreTiles.at(0).text()).toContain(expectedScores[0].toString())
      expect(scoreTiles.at(1).text()).toContain(expectedScores[1].toString())
      expect(scoreTiles.at(2).text()).toContain(expectedScores[2].toString())
    })

    it('handles zero scores (farkles) correctly in accumulation', async () => {
      const scoreComponent = wrapper.findComponent(Score)
      const farkleTurn = wrapper.findComponent(FarkleTurn)

      // Round 1: Alice scores, Bob farkles, Charlie scores
      farkleTurn.vm.$emit('score', 100) // Alice: 100
      await wrapper.vm.$nextTick()
      farkleTurn.vm.$emit('score', 0)   // Bob: 0
      await wrapper.vm.$nextTick()
      farkleTurn.vm.$emit('score', 200) // Charlie: 200
      await wrapper.vm.$nextTick()

      let scoreTiles = scoreComponent.findAll('.list__tile__action')
      expect(scoreTiles.at(0).text()).toContain('100')
      expect(scoreTiles.at(1).text()).toContain('0')
      expect(scoreTiles.at(2).text()).toContain('200')

      // Round 2: Alice farkles, Bob scores, Charlie farkles
      farkleTurn.vm.$emit('score', 0)   // Alice: 100 + 0 = 100
      await wrapper.vm.$nextTick()
      farkleTurn.vm.$emit('score', 150) // Bob: 0 + 150 = 150
      await wrapper.vm.$nextTick()
      farkleTurn.vm.$emit('score', 0)   // Charlie: 200 + 0 = 200
      await wrapper.vm.$nextTick()

      scoreTiles = scoreComponent.findAll('.list__tile__action')
      expect(scoreTiles.at(0).text()).toContain('100')
      expect(scoreTiles.at(1).text()).toContain('150')
      expect(scoreTiles.at(2).text()).toContain('200')
    })
  })

  describe('Reactive updates', () => {
    it('Score component updates reactively without remounting', async () => {
      const scoreComponent = wrapper.findComponent(Score)
      const farkleTurn = wrapper.findComponent(FarkleTurn)

      // Get initial reference to score component
      const scoreComponentId = scoreComponent.vm._uid

      // Update scores multiple times
      farkleTurn.vm.$emit('score', 100)
      await wrapper.vm.$nextTick()

      farkleTurn.vm.$emit('score', 200)
      await wrapper.vm.$nextTick()

      farkleTurn.vm.$emit('score', 300)
      await wrapper.vm.$nextTick()

      // Score component should still be the same instance (not remounted)
      const updatedScoreComponent = wrapper.findComponent(Score)
      expect(updatedScoreComponent.vm._uid).toBe(scoreComponentId)

      // But should show updated scores
      const scoreTiles = updatedScoreComponent.findAll('.list__tile__action')
      expect(scoreTiles.at(0).text()).toContain('100')
      expect(scoreTiles.at(1).text()).toContain('200')
      expect(scoreTiles.at(2).text()).toContain('300')
    })

    it('Score component reflects immediate score changes', async () => {
      const scoreComponent = wrapper.findComponent(Score)
      const farkleTurn = wrapper.findComponent(FarkleTurn)

      // Emit score and check immediately after nextTick
      farkleTurn.vm.$emit('score', 500)
      await wrapper.vm.$nextTick()

      let scoreTiles = scoreComponent.findAll('.list__tile__action')
      expect(scoreTiles.at(0).text()).toContain('500')

      // Emit another score for next player
      farkleTurn.vm.$emit('score', 750)
      await wrapper.vm.$nextTick()

      scoreTiles = scoreComponent.findAll('.list__tile__action')
      expect(scoreTiles.at(1).text()).toContain('750')
    })
  })

  describe('Integration with different player counts', () => {
    it('works correctly with 2 players', async () => {
      players = [
        { name: 'Alice', score: 0 },
        { name: 'Bob', score: 0 }
      ]
      wrapper = mount(FarkleGame, {
        propsData: { players }
      })

      const scoreComponent = wrapper.findComponent(Score)
      const farkleTurn = wrapper.findComponent(FarkleTurn)

      // Two rounds
      farkleTurn.vm.$emit('score', 100) // Alice: 100
      await wrapper.vm.$nextTick()
      farkleTurn.vm.$emit('score', 200) // Bob: 200
      await wrapper.vm.$nextTick()
      farkleTurn.vm.$emit('score', 150) // Alice: 100 + 150 = 250
      await wrapper.vm.$nextTick()
      farkleTurn.vm.$emit('score', 50)  // Bob: 200 + 50 = 250
      await wrapper.vm.$nextTick()

      const scoreTiles = scoreComponent.findAll('.list__tile__action')
      expect(scoreTiles.length).toBe(2)
      expect(scoreTiles.at(0).text()).toContain('250')
      expect(scoreTiles.at(1).text()).toContain('250')
    })

    it('works correctly with 4 players', async () => {
      players = [
        { name: 'Alice', score: 0 },
        { name: 'Bob', score: 0 },
        { name: 'Charlie', score: 0 },
        { name: 'Dave', score: 0 }
      ]
      wrapper = mount(FarkleGame, {
        propsData: { players }
      })

      const scoreComponent = wrapper.findComponent(Score)
      const farkleTurn = wrapper.findComponent(FarkleTurn)

      // One complete round
      farkleTurn.vm.$emit('score', 100) // Alice
      await wrapper.vm.$nextTick()
      farkleTurn.vm.$emit('score', 200) // Bob
      await wrapper.vm.$nextTick()
      farkleTurn.vm.$emit('score', 300) // Charlie
      await wrapper.vm.$nextTick()
      farkleTurn.vm.$emit('score', 400) // Dave
      await wrapper.vm.$nextTick()

      const scoreTiles = scoreComponent.findAll('.list__tile__action')
      expect(scoreTiles.length).toBe(4)
      expect(scoreTiles.at(0).text()).toContain('100')
      expect(scoreTiles.at(1).text()).toContain('200')
      expect(scoreTiles.at(2).text()).toContain('300')
      expect(scoreTiles.at(3).text()).toContain('400')
    })
  })

  describe('High score scenarios', () => {
    it('displays large score values correctly', async () => {
      const scoreComponent = wrapper.findComponent(Score)
      const farkleTurn = wrapper.findComponent(FarkleTurn)

      // Simulate high-scoring turns
      farkleTurn.vm.$emit('score', 3000) // Alice: 3000 (six of a kind)
      await wrapper.vm.$nextTick()
      farkleTurn.vm.$emit('score', 2500) // Bob: 2500 (two triples)
      await wrapper.vm.$nextTick()
      farkleTurn.vm.$emit('score', 1500) // Charlie: 1500 (straight)
      await wrapper.vm.$nextTick()

      // Second round with more high scores
      farkleTurn.vm.$emit('score', 2000) // Alice: 3000 + 2000 = 5000
      await wrapper.vm.$nextTick()
      farkleTurn.vm.$emit('score', 1500) // Bob: 2500 + 1500 = 4000
      await wrapper.vm.$nextTick()
      farkleTurn.vm.$emit('score', 3000) // Charlie: 1500 + 3000 = 4500
      await wrapper.vm.$nextTick()

      const scoreTiles = scoreComponent.findAll('.list__tile__action')
      expect(scoreTiles.at(0).text()).toContain('5000')
      expect(scoreTiles.at(1).text()).toContain('4000')
      expect(scoreTiles.at(2).text()).toContain('4500')
    })

    it('handles score accumulation reaching 10000+', async () => {
      const scoreComponent = wrapper.findComponent(Score)
      const farkleTurn = wrapper.findComponent(FarkleTurn)

      // Manually set high initial scores for faster testing
      players[0].score = 9500
      players[1].score = 9800
      players[2].score = 9700
      await wrapper.vm.$nextTick()

      // Add final scoring round
      farkleTurn.vm.$emit('score', 1000) // Alice: 10500
      await wrapper.vm.$nextTick()
      farkleTurn.vm.$emit('score', 500)  // Bob: 10300
      await wrapper.vm.$nextTick()
      farkleTurn.vm.$emit('score', 800)  // Charlie: 10500
      await wrapper.vm.$nextTick()

      const scoreTiles = scoreComponent.findAll('.list__tile__action')
      expect(scoreTiles.at(0).text()).toContain('10500')
      expect(scoreTiles.at(1).text()).toContain('10300')
      expect(scoreTiles.at(2).text()).toContain('10500')
    })
  })
})
