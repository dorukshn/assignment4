// Doruk Şahin, 2023502030
// Object destructuring (forms 5 to 10). Run with `node js/objects.mjs`.

const song = { id: 's1', title: 'Blinding Lights', artist: 'The Weeknd', bpm: 171, year: 2019 }

// Form 5: take properties out of an object by name, let { a, b } = t
let { title, artist } = song
console.log('form 5:', title, '-', artist)
// The same without destructuring:
//   let title = song.title
//   let artist = song.artist
// With let the new variable can change; the object does not change with it.
title = 'Save Your Tears'
console.log('form 5 (variable changed, object did not):', title, '|', song.title)
// A property that does not exist gives undefined.
const { album } = song
console.log('form 5 (missing property):', album)

// Form 6: rename while you take it, { title: songName }
const { title: songName, bpm: tempo } = song
console.log('form 6:', songName, tempo)
// After a rename only the new name exists. `bpm` was never declared.
try {
  console.log(bpm)
} catch (error) {
  console.log('form 6 (old name):', error.message)
}

// Form 7: default values, { rating = 3 }
const { rating = 3, explicit = false } = song
console.log('form 7:', rating, explicit)
// If the property is there, the default is ignored.
const { year = 2000 } = song
console.log('form 7 (real value wins):', year)
// null is a real value, so the default is NOT used.
const { cover = 'no-cover.png' } = { cover: null }
console.log('form 7 (null is kept):', cover)

// Form 8: rest in an object, { id, ...others }
const { id, ...songWithoutId } = song
console.log('form 8:', id, songWithoutId)
// The rest is a new object, not the old one.
console.log('form 8 (a new object):', songWithoutId !== song)

// Form 9: nested patterns, and arrays inside objects
const playlist = {
  name: 'Sunday Drive',
  owner: { username: 'doruk', country: 'TR' },
  songs: [song, { id: 's2', title: 'Levitating', artist: 'Dua Lipa', bpm: 103, year: 2020 }],
}
const {
  owner: { username },
  songs: [firstSong, { title: secondTitle }],
} = playlist
console.log('form 9:', username, '|', firstSong.title, '|', secondTitle)
// `owner:` in a nested pattern is only a path, it does not create a variable.
try {
  console.log(owner)
} catch (error) {
  console.log('form 9 (owner is not a variable):', error.message)
}

// Form 10: a computed key, { [key]: value }
const sortBy = 'artist'
const { [sortBy]: sortValue } = song
console.log('form 10:', sortBy, '=', sortValue)
for (const key of ['title', 'year']) {
  const { [key]: value } = song
  console.log('form 10 (in a loop):', key, '=', value)
}
