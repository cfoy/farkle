import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { vuetifyStubs } from '../setup'
import FarkleGame from '@/components/FarkleGame.vue'
import FarkleTurn from '@/components/FarkleTurn.vue'

describe('Turn Scoring and Player Rotation Integration', () => {
  let wrapper
  let players

  beforeEach(() => {
    players = [
      { name: 'Alice', score: 0 },
      { name: 'Bob', score: 0 },
      { name: 'Charlie', score: 0 }
    ]
    wrapper = mount(FarkleGame, {
      global: {
        stubs: vuetifyStubs
      },
      props: { players }
    })
  })

  describe('Score events update correct player', () => {
    it('updates first player score when they score points', async () => {
      expect(wrapper.vm.currentPlayer).toBe(0)
      expect(players[0].score).toBe(0)

      // Trigger score event from FarkleTurn
      const farkleTurn = wrapper.findComponent(FarkleTurn)
      farkleTurn.vm.$emit('score', 150)
      await wrapper.vm.$nextTick()

      // First player's score should be updated
      expect(players[0].score).toBe(150)
      expect(players[1].score).toBe(0)
      expect(players[2].score).toBe(0)
    })

    it('updates second player score after turn rotation', async () => {
      // First player scores
      const farkleTurn = wrapper.findComponent(FarkleTurn)
      farkleTurn.vm.$emit('score', 100)
      await wrapper.vm.$nextTick()

      // Current player should now be second player
      expect(wrapper.vm.currentPlayer).toBe(1)
      expect(players[0].score).toBe(100)
      expect(players[1].score).toBe(0)

      // Second player scores
      farkleTurn.vm.$emit('score', 200)
      await wrapper.vm.$nextTick()

      // Second player's score should be updated
      expect(players[0].score).toBe(100)
      expect(players[1].score).toBe(200)
      expect(players[2].score).toBe(0)
    })

    it('updates third player score after multiple rotations', async () => {
      const farkleTurn = wrapper.findComponent(FarkleTurn)

      // First player scores
      farkleTurn.vm.$emit('score', 100)
      await wrapper.vm.$nextTick()

      // Second player scores
      farkleTurn.vm.$emit('score', 200)
      await wrapper.vm.$nextTick()

      // Current player should now be third player
      expect(wrapper.vm.currentPlayer).toBe(2)

      // Third player scores
      farkleTurn.vm.$emit('score', 300)
      await wrapper.vm.$nextTick()

      // Third player's score should be updated
      expect(players[0].score).toBe(100)
      expect(players[1].score).toBe(200)
      expect(players[2].score).toBe(300)
    })
  })

  describe('Turn rotation advances properly', () => {
    it('advances from first to second player after scoring', async () => {
      expect(wrapper.vm.currentPlayer).toBe(0)
      expect(wrapper.vm.currentPlayerName).toBe('Alice')

      const farkleTurn = wrapper.findComponent(FarkleTurn)
      farkleTurn.vm.$emit('score', 100)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.currentPlayer).toBe(1)
      expect(wrapper.vm.currentPlayerName).toBe('Bob')
    })

    it('advances from second to third player after scoring', async () => {
      // Advance to second player
      const farkleTurn = wrapper.findComponent(FarkleTurn)
      farkleTurn.vm.$emit('score', 100)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.currentPlayer).toBe(1)
      expect(wrapper.vm.currentPlayerName).toBe('Bob')

      // Score and advance to third player
      farkleTurn.vm.$emit('score', 200)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.currentPlayer).toBe(2)
      expect(wrapper.vm.currentPlayerName).toBe('Charlie')
    })

    it('wraps around from last player to first player', async () => {
      const farkleTurn = wrapper.findComponent(FarkleTurn)

      // Advance through all players
      farkleTurn.vm.$emit('score', 100) // Alice -> Bob
      await wrapper.vm.$nextTick()

      farkleTurn.vm.$emit('score', 200) // Bob -> Charlie
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.currentPlayer).toBe(2)
      expect(wrapper.vm.currentPlayerName).toBe('Charlie')

      // Last player scores, should wrap to first
      farkleTurn.vm.$emit('score', 300) // Charlie -> Alice
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.currentPlayer).toBe(0)
      expect(wrapper.vm.currentPlayerName).toBe('Alice')
    })

    it('continues rotation after wrap-around', async () => {
      const farkleTurn = wrapper.findComponent(FarkleTurn)

      // Complete one full round
      farkleTurn.vm.$emit('score', 100) // Alice -> Bob
      await wrapper.vm.$nextTick()
      farkleTurn.vm.$emit('score', 200) // Bob -> Charlie
      await wrapper.vm.$nextTick()
      farkleTurn.vm.$emit('score', 300) // Charlie -> Alice
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.currentPlayer).toBe(0)

      // Continue into second round
      farkleTurn.vm.$emit('score', 150) // Alice -> Bob
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.currentPlayer).toBe(1)
      expect(wrapper.vm.currentPlayerName).toBe('Bob')
    })
  })

  describe('Score accumulation across turns', () => {
    it('accumulates scores for the same player across multiple rounds', async () => {
      const farkleTurn = wrapper.findComponent(FarkleTurn)

      // Round 1: Alice scores 100
      farkleTurn.vm.$emit('score', 100)
      await wrapper.vm.$nextTick()
      expect(players[0].score).toBe(100)

      // Bob and Charlie score
      farkleTurn.vm.$emit('score', 0)
      await wrapper.vm.$nextTick()
      farkleTurn.vm.$emit('score', 0)
      await wrapper.vm.$nextTick()

      // Round 2: Alice scores 200 more
      expect(wrapper.vm.currentPlayer).toBe(0)
      farkleTurn.vm.$emit('score', 200)
      await wrapper.vm.$nextTick()

      // Alice's score should accumulate
      expect(players[0].score).toBe(300)
    })

    it('maintains independent scores for all players across rounds', async () => {
      const farkleTurn = wrapper.findComponent(FarkleTurn)

      // Round 1
      farkleTurn.vm.$emit('score', 100) // Alice: 100
      await wrapper.vm.$nextTick()
      farkleTurn.vm.$emit('score', 200) // Bob: 200
      await wrapper.vm.$nextTick()
      farkleTurn.vm.$emit('score', 300) // Charlie: 300
      await wrapper.vm.$nextTick()

      expect(players[0].score).toBe(100)
      expect(players[1].score).toBe(200)
      expect(players[2].score).toBe(300)

      // Round 2
      farkleTurn.vm.$emit('score', 150) // Alice: 100 + 150 = 250
      await wrapper.vm.$nextTick()
      farkleTurn.vm.$emit('score', 50) // Bob: 200 + 50 = 250
      await wrapper.vm.$nextTick()
      farkleTurn.vm.$emit('score', 100) // Charlie: 300 + 100 = 400
      await wrapper.vm.$nextTick()

      expect(players[0].score).toBe(250)
      expect(players[1].score).toBe(250)
      expect(players[2].score).toBe(400)
    })

    it('handles farkle (zero points) correctly and still rotates', async () => {
      const farkleTurn = wrapper.findComponent(FarkleTurn)

      // Alice farkles (scores 0)
      farkleTurn.vm.$emit('score', 0)
      await wrapper.vm.$nextTick()

      // Alice's score should remain 0 and turn should rotate to Bob
      expect(players[0].score).toBe(0)
      expect(wrapper.vm.currentPlayer).toBe(1)
      expect(wrapper.vm.currentPlayerName).toBe('Bob')

      // Bob scores normally
      farkleTurn.vm.$emit('score', 100)
      await wrapper.vm.$nextTick()

      expect(players[1].score).toBe(100)
      expect(wrapper.vm.currentPlayer).toBe(2)
    })
  })

  describe('Integration with two players', () => {
    beforeEach(() => {
      players = [
        { name: 'Alice', score: 0 },
        { name: 'Bob', score: 0 }
      ]
      wrapper = mount(FarkleGame, {
        props: { players }
      })
    })

    it('alternates between two players correctly', async () => {
      const farkleTurn = wrapper.findComponent(FarkleTurn)

      // Alice's turn
      expect(wrapper.vm.currentPlayer).toBe(0)
      farkleTurn.vm.$emit('score', 100)
      await wrapper.vm.$nextTick()

      // Bob's turn
      expect(wrapper.vm.currentPlayer).toBe(1)
      expect(players[0].score).toBe(100)
      farkleTurn.vm.$emit('score', 200)
      await wrapper.vm.$nextTick()

      // Back to Alice's turn
      expect(wrapper.vm.currentPlayer).toBe(0)
      expect(players[1].score).toBe(200)
      farkleTurn.vm.$emit('score', 150)
      await wrapper.vm.$nextTick()

      // Back to Bob's turn
      expect(wrapper.vm.currentPlayer).toBe(1)
      expect(players[0].score).toBe(250)
    })
  })

  describe('Integration with four players', () => {
    beforeEach(() => {
      players = [
        { name: 'Alice', score: 0 },
        { name: 'Bob', score: 0 },
        { name: 'Charlie', score: 0 },
        { name: 'Dave', score: 0 }
      ]
      wrapper = mount(FarkleGame, {
        props: { players }
      })
    })

    it('rotates through four players and wraps correctly', async () => {
      const farkleTurn = wrapper.findComponent(FarkleTurn)

      // Complete one round
      expect(wrapper.vm.currentPlayerName).toBe('Alice')
      farkleTurn.vm.$emit('score', 100)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.currentPlayerName).toBe('Bob')
      farkleTurn.vm.$emit('score', 200)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.currentPlayerName).toBe('Charlie')
      farkleTurn.vm.$emit('score', 300)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.currentPlayerName).toBe('Dave')
      farkleTurn.vm.$emit('score', 400)
      await wrapper.vm.$nextTick()

      // Should wrap back to Alice
      expect(wrapper.vm.currentPlayer).toBe(0)
      expect(wrapper.vm.currentPlayerName).toBe('Alice')

      // Verify all scores
      expect(players[0].score).toBe(100)
      expect(players[1].score).toBe(200)
      expect(players[2].score).toBe(300)
      expect(players[3].score).toBe(400)
    })
  })
})
