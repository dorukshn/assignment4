// Doruk Şahin, 2023502030
// Things that surprise people. Run with `node js/pitfalls.mjs`.

const library = [
  { title: 'Yellow', artist: 'Coldplay', bpm: 87, owner: { username: 'doruk' } },
  { title: 'Creep', artist: 'Radiohead', bpm: 92, owner: { username: 'doruk' } },
]
const findSong = (title) => library.find((s) => s.title === title)

// Pitfall 1: destructuring undefined or null throws a TypeError.
try {
  const { bpm } = findSong('Unknown Song') // find returns undefined
  console.log(bpm)
} catch (error) {
  console.log('pitfall 1:', error.constructor.name, '-', error.message)
}

// Pitfall 2: a default only applies to undefined, not to null
const fromApi = { title: 'Creep', artist: null }
const { artist = 'Unknown artist', album = 'Unknown album' } = fromApi
console.log('pitfall 2:', artist, '|', album)

// Pitfall 3: assigning without const/let needs parentheses, ({ a } = obj)
let title
let bpm
;({ title, bpm } = library[0])
console.log('pitfall 3 (with parentheses):', title, bpm)
// Without parentheses the line starts with `{`, which JavaScript reads as a block.
try {
  new Function('let title; { title } = { title: "Yellow" }')
} catch (error) {
  console.log('pitfall 3 (without):', error.name, '-', error.message)
}

// Pitfall 4: it copies references, not deep copies (nested objects are shared)
const { title: copiedTitle, ...rest } = library[1]
rest.owner.username = 'someone-else' // I only changed the copy... or did I?
console.log('pitfall 4:', copiedTitle, '|', library[1].owner.username, '|', rest.owner === library[1].owner)

// Pitfall 5: in objects the order does not matter, in arrays it does
const { bpm: speed, title: name } = library[0]
console.log('pitfall 5 (object, any order):', name, speed)
const [songArtist, songTitle] = ['Yellow', 'Coldplay'] // I meant [title, artist]
console.log('pitfall 5 (array, order matters):', songArtist, 'by', songTitle)

// Pitfall 6: a missing semicolon before a line that starts with [ joins the two lines.
try {
  new Function("let a = 'Yellow'\nlet b = 'Creep'\n[a, b] = [b, a]")()
} catch (error) {
  console.log('pitfall 6:', error.name, '-', error.message)
}
