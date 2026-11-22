// Doruk Şahin, 2023502030
// The same four array forms as js/arrays.mjs, now typed. Run with `npx tsx ts/arrays.ts`.

// Form 1: the return type is a tuple, so every position has its own type.
function shortestAndLongest(lengths: number[]): [number, number] {
  return [Math.min(...lengths), Math.max(...lengths)]
}
const [shortest, longest] = shortestAndLongest([214, 187, 356, 241])
console.log('form 1:', shortest, longest)
// A tuple can mix types: position 0 is a string, position 1 is a number.
function topSong(): [string, number] {
  return ['Blinding Lights', 171]
}
const [hit, hitBpm] = topSong()
console.log('form 1 (tuple [string, number]):', hit.toUpperCase(), hitBpm + 1)

// Form 2: skip an item and collect the rest.
const queue: string[] = ['Intro', 'Blinding Lights', 'Levitating', 'As It Was', 'Outro']
const [, firstRealSong, ...laterSongs] = queue
// firstRealSong is `string | undefined` (noUncheckedIndexedAccess), laterSongs is `string[]`.
console.log('form 2:', firstRealSong ?? '(queue too short)', laterSongs)

// Form 3: swap two variables. Both sides must have compatible types.
let nowPlaying: string = 'Levitating'
let upNext: string = 'As It Was'
;[nowPlaying, upNext] = [upNext, nowPlaying]
console.log('form 3:', nowPlaying, '|', upNext)

// Form 4: default values. With a default the type has no `undefined` in it.
const setList: string[] = []
const [opener = 'Intro', closer = 'Outro'] = setList
console.log('form 4:', opener.toUpperCase(), closer)
const moods: (string | undefined)[] = ['party', undefined]
const [mood = 'chill', energy = 'medium'] = moods
console.log('form 4 (undefined uses the default):', mood, energy)
