// Doruk Şahin, 2023502030
// One mistake per form, for the JavaScript versus TypeScript table in README.md.
// This file is not part of `npm run check`. Run `npx tsc --noEmit -p experiments`.

type Song = { id: string; title: string; artist: string; bpm: number; rating?: number }
const song: Song = { id: 's1', title: 'Creep', artist: 'Radiohead', bpm: 92 }

// Form 1: no tuple return type, so both items are string | number.
function looseTopSong() {
  return ['Yellow', 87]
}
const [looseTitle] = looseTopSong()
looseTitle.toUpperCase()

// Form 2: the skipped-to item may be missing.
const queue: string[] = ['Intro', 'Yellow']
const [, secondSong] = queue
secondSong.toUpperCase()

// Form 3: swapping a string and a number.
let songName = 'Yellow'
let songBpm = 87
;[songName, songBpm] = [songBpm, songName]

// Form 7: an optional field without a default.
const { rating } = song
rating.toFixed(1)

// Form 8: the rest object no longer has id.
const { id, ...withoutId } = song
withoutId.id

// Form 10: a computed key that is any string.
const key: string = 'artist'
const { [key]: value } = song

// Form 11: a typo in an option name.
type PlaylistOptions = { name?: string; shuffle?: boolean }
function makePlaylist({ name = 'Untitled', shuffle = false }: PlaylistOptions = {}) {
  return `${name} ${shuffle}`
}
makePlaylist({ nam: 'Gym Mix' })

// Form 12: the Map values are numbers, not strings.
const stars = new Map<string, number>([['Creep', 5]])
for (const [title, count] of stars) {
  count.toUpperCase()
}
export { id, value }
