// Doruk Şahin, 2023502030
// Bonus 2: Depth. Experiments that go beyond the twelve forms. Run with `node js/depth.mjs`.

// 1. An array pattern works on ANY iterable, not only arrays.
const [firstLetter, ...otherLetters] = 'Creep'
console.log('depth 1 (string):', firstLetter, otherLetters)
const [firstGenre] = new Set(['rock', 'pop', 'rock'])
console.log('depth 1 (Set):', firstGenre)
const [[firstKey, firstValue]] = new Map([['Yellow', 87]])
console.log('depth 1 (Map):', firstKey, firstValue)

// 2. What does an array pattern really call? Symbol.iterator, then next() as often as it needs.
const loggingPlaylist = {
  songs: ['Yellow', 'Creep', 'Levitating', 'As It Was'],
  [Symbol.iterator]() {
    console.log('depth 2: Symbol.iterator was called')
    let i = 0
    return {
      next: () => {
        console.log('depth 2: next() call', i + 1)
        return i < this.songs.length ? { value: this.songs[i++], done: false } : { value: undefined, done: true }
      },
      return: () => {
        console.log('depth 2: return() was called, the pattern stopped early')
        return { value: undefined, done: true }
      },
    }
  },
}
const [one, two] = loggingPlaylist
console.log('depth 2: got', one, two)

// 3. A generator: the pattern only pulls the items it needs, the rest never runs.
function* radio() {
  console.log('depth 3: playing song 1')
  yield 'Yellow'
  console.log('depth 3: playing song 2')
  yield 'Creep'
  console.log('depth 3: playing song 3 (never printed if nobody asks)')
  yield 'Levitating'
}
const [firstOnRadio] = radio()
console.log('depth 3: got', firstOnRadio)

// 4. A plain object is not iterable, so an array pattern on it throws.
try {
  const [x] = { title: 'Yellow' }
  console.log(x)
} catch (error) {
  console.log('depth 4:', error.constructor.name, '-', error.message)
}

// 5. Order of evaluation: a default is only computed when it is needed.
let lookups = 0
function lookUpBpm() {
  lookups++
  return 100
}
const [bpmA = lookUpBpm()] = [87]
const [bpmB = lookUpBpm()] = []
console.log('depth 5:', bpmA, bpmB, 'lookups =', lookups)

// 6. A default can use a name that comes EARLIER in the same pattern, but not a later one.
const [introLength, outroLength = introLength * 2] = [30]
console.log('depth 6 (earlier name):', introLength, outroLength)
try {
  new Function('const [a = b, b = 1] = []')()
} catch (error) {
  console.log('depth 6 (later name):', error.constructor.name, '-', error.message)
}

// 7. Destructuring in other places: catch, and assignment to object properties.
try {
  JSON.parse('{ title: Yellow }')
} catch ({ name, message }) {
  console.log('depth 7 (catch):', name, '-', message)
}
const player = { current: '', next: '' }
;[player.current, player.next] = ['Yellow', 'Creep']
console.log('depth 7 (assignment targets):', player)

// 8. for...in gives only the keys (strings); for...of with entries() gives [key, value] pairs.
const bpms = { Yellow: 87, Creep: 92 }
for (const key in bpms) console.log('depth 8 (for...in):', key)
for (const [key, value] of Object.entries(bpms)) console.log('depth 8 (for...of + entries):', key, value)
