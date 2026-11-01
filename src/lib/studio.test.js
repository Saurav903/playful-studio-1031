import test from 'node:test'
import assert from 'node:assert/strict'
import { COACH_LINES, SEEDS, createScene, nextCoachLine } from './studio.js'

test('createScene uses selected memory pieces', () => {
  const scene = createScene(SEEDS[0], ['sun', 'water'])
  assert.match(scene, /sunlight/)
  assert.match(scene, /water/)
})

test('createScene offers a useful empty state', () => {
  assert.match(createScene(SEEDS[0], []), /Start with/i)
})

test('nextCoachLine cycles safely', () => {
  assert.equal(nextCoachLine(COACH_LINES.length), COACH_LINES[0])
})
