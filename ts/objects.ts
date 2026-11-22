// Doruk Şahin, 2023502030
// The same six object forms as js/objects.mjs, now typed. Run with `npx tsx ts/objects.ts`.

type Song = {
  id: string
  title: string
  artist: string
  bpm: number
  year: number
  rating?: number // optional: a song may have no rating yet
}

const song: Song = { id: 's1', title: 'Blinding Lights', artist: 'The Weeknd', bpm: 171, year: 2019 }

// Form 5: properties by name. TypeScript knows title and artist are strings.
let { title, artist } = song
console.log('form 5:', title, '-', artist)
title = 'Save Your Tears' // still a string, so this is allowed
console.log('form 5 (variable changed, object did not):', title, '|', song.title)

// Form 6: rename while you take it. The type goes AFTER the whole pattern, never inside it.
const { title: songName, bpm: tempo }: Song = song
console.log('form 6:', songName, tempo)

// Form 7: default values. `rating` is optional (number | undefined); with a default it is number.
const { rating = 3 } = song
console.log('form 7:', rating, rating.toFixed(1))

// Form 8: rest in an object. The type of the rest is Song without id.
const { id, ...songWithoutId } = song
const withoutId: Omit<Song, 'id'> = songWithoutId
console.log('form 8:', id, withoutId)

// Form 9: nested patterns, and arrays inside objects.
type Playlist = {
  name: string
  owner: { username: string; country: string }
  songs: Song[]
}
const playlist: Playlist = {
  name: 'Sunday Drive',
  owner: { username: 'doruk', country: 'TR' },
  songs: [song, { id: 's2', title: 'Levitating', artist: 'Dua Lipa', bpm: 103, year: 2020 }],
}
const {
  owner: { username },
  songs: [firstSong, secondSong],
} = playlist
// The array items may be missing, so they are `Song | undefined`.
console.log('form 9:', username, '|', firstSong?.title, '|', secondSong?.title)

// Form 10: a computed key. The key must be a key of Song.
const sortBy: keyof Song = 'artist'
const { [sortBy]: sortValue } = song
console.log('form 10:', sortBy, '=', sortValue)
for (const key of ['title', 'year'] as const) {
  const { [key]: value } = song // value is string | number
  console.log('form 10 (in a loop):', key, '=', value)
}
