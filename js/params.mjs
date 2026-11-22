// Doruk Şahin, 2023502030
// Destructuring in parameters and loops (forms 11 and 12). Run with `node js/params.mjs`.

// Form 11: an options object in the parameter list, with defaults.
function makePlaylist({ name, shuffle = false, maxSongs = 20 } = {}) {
  return `${name} (shuffle: ${shuffle}, max ${maxSongs})`
}
console.log('form 11:', makePlaylist({ name: 'Gym Mix', shuffle: true }))
// The `= {}` at the end is the default for the WHOLE argument.
console.log('form 11 (no argument):', makePlaylist())
// null is not undefined, so `= {}` is not used and destructuring null throws.
try {
  makePlaylist(null)
} catch (error) {
  console.log('form 11 (null):', error.message)
}

// Form 11b: the same idea with an array parameter, ([x, y]) => ...
const toLabel = ([songTitle, songArtist]) => `${songTitle} by ${songArtist}`
console.log('form 11b:', toLabel(['Yellow', 'Coldplay']))
const pairs = [
  ['Yellow', 'Coldplay'],
  ['Creep', 'Radiohead'],
]
console.log('form 11b (in map):', pairs.map(([t, a]) => `${a}: ${t}`))

// Form 12: patterns in loops, Object.entries and a Map
const playCounts = { 'Blinding Lights': 42, Levitating: 17, Yellow: 8 }
for (const [songTitle, count] of Object.entries(playCounts)) {
  console.log('form 12:', songTitle, '->', count)
}
const stars = new Map([
  ['Creep', 5],
  ['Yellow', 4],
])
for (const [songTitle, rating] of stars) {
  console.log('form 12 (Map):', songTitle, '*'.repeat(rating))
}
for (const [index, songTitle] of ['Intro', 'Outro'].entries()) {
  console.log('form 12 (array.entries):', index, songTitle)
}
const library = [
  { title: 'Yellow', bpm: 87 },
  { title: 'Creep', bpm: 92 },
]
for (const { title, bpm } of library) {
  console.log('form 12 (objects in a loop):', title, bpm)
}
